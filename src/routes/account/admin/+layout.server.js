import { redirect } from '@sveltejs/kit';

export async function load({ locals }) {
	console.log(locals.user);
	if (!locals.user || !locals.user.isAdmin) {
		throw redirect(303, '/login');
	}
}
