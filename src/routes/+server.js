import { json } from '@sveltejs/kit';
import { GOOGLE_APP_PASSWORD } from '$env/static/private';
import { GOOGLE_APP_USER } from '$env/static/private';
import nodemailer from 'nodemailer';

export async function POST({ request }) {
    const { message } = await request.json();

    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
            user: GOOGLE_APP_USER,
            pass: GOOGLE_APP_PASSWORD
        },
    });

    const options = {
        from: GOOGLE_APP_USER,
        to: GOOGLE_APP_USER,
        subject: `ORDER: ${Date.now()}`,
        text: message
    }

    await transporter.sendMail(options, (err, info) => {
        if (err) {
            console.log('Error', err);
            return json({ status: 400 })
        }
        else console.log('Email Sent', info.response);
    });

    return json({ status: 200 });
}



