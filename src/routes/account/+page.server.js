import { User } from '$lib/server/models/User';

/** @type {import('./$types').PageLoad} */
export async function load({ locals }) {
	const user = await User.findById(locals.user.id);
	const notificationConsent = user.notificationConsent;
	return { notificationConsent };
}
