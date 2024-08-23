import { json } from '@sveltejs/kit';
import { GOOGLE_APP_PASSWORD } from '$env/static/private';
import nodemailer from 'nodemailer';

export async function POST({ request }) {
    const { message } = await request.json();

    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
            user: 'isaacyates.creative@gmail.com',
            pass: GOOGLE_APP_PASSWORD
        },
    });

    const options = {
        from: 'isaacyates.creative@gmail.com',
        to: 'isaacyates.creative@gmail.com',
        subject: `ORDER: ${Date.now()}`,
        text: message
    }

    transporter.sendMail(options, (err, info) => {
        if (err) {
            console.log('Error', err);
            return json({ status: 400 })
        }
        else console.log('Email Sent', info.response);
    });

    return json({ status: 200 });
}



