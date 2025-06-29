import { goto } from '$app/navigation';
import { getUserFromSession } from '$lib/server/utils/auth'; // Your own function to check cookies/session

/** @type {import('@sveltejs/kit').Handle} */
export async function handle({ event, resolve }) {
	// grab session token from cookie
	const token = event.cookies.get('authToken');

	// if the token exists, get the user, otherwise set user to null
	const user = token ? await getUserFromSession(token) : null;

	event.locals.user = user; // Attach to locals

	return resolve(event);
}
