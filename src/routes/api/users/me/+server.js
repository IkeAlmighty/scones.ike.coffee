import { json } from '@sveltejs/kit';
import { connectToDatabase } from '$lib/server/utils/mongoose';
import { User } from '$lib/server/models/User';
import { getUserFromSession } from '$lib/server/utils/auth.js';

export async function GET({ cookies }) {
	const token = cookies.get('authToken');

	if (!token) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	try {
		const user = await getUserFromSession(token);

		if (!user) {
			return json({ error: 'User not found' }, { status: 404 });
		}

		return json(user);
	} catch (err) {
		console.log(err);
		return json({ error: 'Invalid token' }, { status: 401 });
	}
}
