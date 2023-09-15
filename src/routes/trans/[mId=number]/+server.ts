import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import db from '$lib/db';

export const POST: RequestHandler = async ({ request, params }) => {
	let monthId = +params.mId;
	let trans = await request.json();
	let out = [];
	for (const t of trans) {
		out.push(
			await db.trans.create({
				data: { ...t, id: undefined, monthId },
			})
		);
	}
	return json(out);
};
