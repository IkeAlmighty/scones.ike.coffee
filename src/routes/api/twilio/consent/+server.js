import mongoose from 'mongoose';
import { connectToDatabase } from '$lib/server/utils/mongoose.js';
import { json } from '@sveltejs/kit';
import { User } from '$lib/server/models/User.js';

export async function POST({ request, locals }) {
	await connectToDatabase();

	if (!locals.user) {
		return json({ error: 'Unauthorized' }, { status: 401 });
	}

	try {
		const user = await User.findById(locals.user.id);
		user.notificationConsent = !user.notificationConsent;
		user.save();

		return json({
			message: `${user.username}'s notification settings have been set to ${user.notificationConsent}`
		});
	} catch (err) {
		console.error('❌ Error toggling notifications:', err);
		return new Response('Server error', { status: 500 });
	}
}
