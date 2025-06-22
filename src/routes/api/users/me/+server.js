import { json } from '@sveltejs/kit';
import jwt from 'jsonwebtoken';
import { connectToDatabase } from '$lib/server/mongoose';
import { User } from '$lib/server/models/User';
import { JWT_SECRET } from '$env/static/private';
import { getUserFromSession } from '$lib/server/auth.js';

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
