import { json } from '@sveltejs/kit';
import jwt from 'jsonwebtoken';
import { connectToDatabase } from '$lib/server/mongoose';
import { User } from '$lib/server/models/User';
import { JWT_SECRET } from '$env/static/private';

export async function GET({ cookies }) {
	const token = cookies.get('authToken');

	if (!token) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	try {
		const payload = jwt.verify(token, JWT_SECRET);

		await connectToDatabase();
		const user = await User.findById(payload.id).lean();

		if (!user) {
			return json({ error: 'User not found' }, { status: 404 });
		}

		return json({
			id: user.id,
			phone: user.phone,
			username: user.username
		});
	} catch (err) {
		console.log(err);
		return json({ error: 'Invalid token' }, { status: 401 });
	}
}
