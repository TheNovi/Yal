import type { Handle } from '@sveltejs/kit';
// import prisma from '$lib/db';

export const handle: Handle = async ({ event, resolve }) => {
	return resolve(event);
};
