import { getMonth } from '$lib/yal/be';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad, Actions } from './$types';
import db from '$lib/db';

export const load: PageServerLoad = async ({ locals }) => {
	return await getMonth(locals.currMonth);
};

export const actions: Actions = {
	default: async ({ request, locals }) => {
		const d = await request.formData();
		locals.currMonth = +(d.get('b') || 0);
		let init = +(d.get('init') || 0);
		if (init) {
			//TODO Validate all values
			let yal = await db.yal.findUnique({
				select: { id: true },
				where: { id: 1 },
			});
			if (!yal) {
				console.log('NewMonth Action | no Yal');
				throw redirect(307, '/');
			}
			let year = +(d.get('year') || 0);
			let month = +(d.get('month') || 0) + 1;
			let blockId = +(d.get('blockId') || 0);
			if (month > 12) {
				year++;
				month = 1;
			}
			await db.month.create({ data: { yalId: yal.id, init, month, year, blockId } });
		}

		return {};
	},
};
