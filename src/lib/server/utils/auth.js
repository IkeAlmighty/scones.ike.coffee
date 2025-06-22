import jwt from 'jsonwebtoken';
import { connectToDatabase } from '$lib/server/utils/mongoose';
import { User } from '$lib/server/models/User';
import { JWT_SECRET } from '$env/static/private';

export async function getUserFromSession(token) {
	try {
		const payload = jwt.verify(token, JWT_SECRET);

		await connectToDatabase();
		const user = await User.findById(payload.id);

		if (!user) {
			return null;
		}

		return {
			id: user.id,
			phone: user.phone,
			username: user.username,
			isAdmin: user.isAdmin
		};
	} catch (err) {
		console.log(err);
	}

	return null;
}
