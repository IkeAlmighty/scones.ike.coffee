import { ADMIN_NUMBER } from '$env/static/private';
import Message from '$lib/server/models/Message';
import { connectToDatabase } from '$lib/server/utils/mongoose';
import { json } from '@sveltejs/kit';
import { formatPhoneNumber } from '$lib/utils.js';

export const GET = async ({ url }) => {
	await connectToDatabase();

	const phoneNumber = formatPhoneNumber(url.searchParams.get('phoneNumber'));

	const messages = await Message.find({ $or: [{ to: phoneNumber }, { from: phoneNumber }] }).lean();

	return json({
		messages
	});
};
