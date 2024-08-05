import { json } from '@sveltejs/kit';
import nodemailer from 'nodemailer';

export async function POST({ request }) {
    const { message } = await request.json();



    return json({ status: 200 });
}



