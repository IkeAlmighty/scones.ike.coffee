import { connectToDatabase, getCollection } from "$lib/db/connection"

export const load = async ({ params }) => {
    await connectToDatabase();

    const today = new Date();
    const todayString = `${today.getFullYear()}-${today.getMonth()}-${today.getDate()}`;

    const claims = await getCollection('claims').findOne({ _id: todayString });

    return { claims }
}