import db from '$lib/db';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
	let yal = await db.yal.findUnique({
		select: { id: true },
		where: { id: 1 },
	});
	if (!yal) return new Response('No Yal', { status: 400 }); //TODO Better status

	let name = await request.text(); //TODO (low priority) Send json
	let o = await db.goal.create({
		select: { id: true, name: true, value: true },
		data: { name, value: 0, yalId: yal.id },
	});
	return json(o);
};

export const PUT: RequestHandler = async ({ request }) => {
	let g = await request.json();
	await db.goal.update({
		data: g,
		where: { id: g.id },
	});
	return new Response();
};

export const DELETE: RequestHandler = async ({ request }) => {
	let id = await request.text();
	await db.goal.delete({
		where: { id: +id },
	});
	return new Response();
};
