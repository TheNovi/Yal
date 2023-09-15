import { redirect } from '@sveltejs/kit';
import db from '../db';
import { calcTotal } from './fe';

export async function getMonth(monthId = 0) {
	console.log('Yal GetMonth | ' + monthId);

	let yal = await db.yal.findUnique({
		select: { id: true, offset: true, Goal: { select: { id: true, name: true, value: true } } },
		where: { id: 1 },
	});
	if (!yal) {
		console.error('Yal | No Yal');
		throw redirect(307, '/');
		//TODO return some error {error: YalNoMonthError}
	}
	let m;
	if (!monthId) {
		m = await db.month.findFirst({
			select: {
				id: true,
				month: true,
				year: true,
				init: true,
				Block: { select: { id: true, name: true, value: true } },
				Trans: {
					select: {
						id: true,
						value: true,
						name: true,
						ignore: true,
					},
				},
			},
			where: { yalId: yal.id },
			orderBy: [{ year: 'desc' }, { month: 'desc' }],
		});
	} else
		m = await db.month.findUnique({
			select: {
				id: true,
				month: true,
				year: true,
				init: true,
				Block: { select: { id: true, name: true, value: true } },
				Trans: {
					select: {
						id: true,
						value: true,
						name: true,
						ignore: true,
					},
				},
			},
			where: { id: monthId },
		});
	if (!m) {
		console.error('Yal | No month');
		throw redirect(307, '/login');
	}
	//TODO Everything below can be done in some sql function
	// Get prev/next month
	let prev = await db.month.findFirst({
		select: {
			// month: true,
			// year: true,
			id: true,
		},
		where: {
			yalId: yal.id,
			OR: [{ year: { lt: m.year } }, { year: m.year, month: { lt: m.month } }],
		},
		orderBy: [{ year: 'desc' }, { month: 'desc' }],
	});
	let next;
	if (monthId)
		next = await db.month.findFirst({
			select: {
				// month: true,
				// year: true,
				id: true,
			},
			where: {
				yalId: yal.id,
				OR: [{ year: { gt: m.year } }, { year: m.year, month: { gt: m.month } }],
			},
			orderBy: [{ year: 'asc' }, { month: 'asc' }],
		});

	// Get all trans
	let t: Month[] = await db.month.findMany({
		select: {
			// month: true,
			// year: true,
			init: true,
			Block: { select: { value: true } },
			Trans: { select: { value: true }, where: { ignore: false } }, //TODO Some cache
		},
		where: {
			yalId: yal.id,
			OR: [{ year: { lt: m.year } }, { year: m.year, month: { lt: m.month } }],
		},
	});
	// console.log(m);
	// console.debug(t);
	return {
		prev: prev?.id,
		next: next?.id,
		offset: yal.offset,
		total: calcTotal(t),
		goals: yal.Goal,
		month: m,
	};
}
