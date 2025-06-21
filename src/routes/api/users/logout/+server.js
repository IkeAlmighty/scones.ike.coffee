import { json } from '@sveltejs/kit';

export const POST = async ({ cookies }) => {
	cookies.set('authToken', '', {
		path: '/',
		httpOnly: true,
		sameSite: 'strict',
		secure: process.env.NODE_ENV === 'production',
		maxAge: 0
	});

	return json({ message: 'Logged out' });
};
