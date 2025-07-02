import { json } from '@sveltejs/kit';

export const POST = async ({ cookies, locals }) => {
	cookies.set('authToken', '', {
		path: '/',
		httpOnly: true,
		sameSite: 'strict',
		secure: process.env.NODE_ENV === 'production',
		maxAge: 0
	});

	// remove from locals:
	locals.user = null;

	return json({ message: 'Logged out' });
};
