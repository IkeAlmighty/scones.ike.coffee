import { goto } from '$app/navigation';
import { getUserFromSession } from '$lib/server/utils/auth'; // Your own function to check cookies/session

/** @type {import('@sveltejs/kit').Handle} */
export async function handle({ event, resolve }) {
	// Example: grab session token from cookie
	const token = event.cookies.get('authToken');

	// You'd implement this function to verify token and get user data
	const user = token ? await getUserFromSession(token) : null;

	event.locals.user = user; // Attach to locals

	return resolve(event);
}
