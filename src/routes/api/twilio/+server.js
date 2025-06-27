import { ADMIN_NUMBER } from "$env/static/private";
import Message from "$lib/server/models/Message";
import { connectToDatabase } from "$lib/server/utils/mongoose"
import { json } from "@sveltejs/kit"

export const GET = async ({ url }) => {
    await connectToDatabase();

    const phoneNumber = url.searchParams.get('phoneNumber');
    console.log(phoneNumber)

    const messages = await Message.find({ $or: [{ to: phoneNumber }, { from: phoneNumber }] }).lean();

    console.log(messages);

    return json({
        messages
    })
}