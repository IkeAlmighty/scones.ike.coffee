import { redirect } from '@sveltejs/kit';

export async function load({ locals }) {
	if (!locals.user || !locals.user.isAdmin) {
		throw redirect(303, '/login');
	}
}
