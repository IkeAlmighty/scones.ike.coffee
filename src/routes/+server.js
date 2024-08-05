import { json } from '@sveltejs/kit';
const accountSid = 'AC9652595dc5ed59d253754ec1b2fd0fcb';
import Client from 'twilio';
import { TWILIO } from '$env/static/private';


export async function POST({ request }) {
    const { message } = await request.json();

    const client = Client(accountSid, TWILIO);
    client.messages
        .create({
            body: message,
            from: '+18334060368',
            to: '+14052024472'
        })
        .then(message => console.log(message.sid))


    return json({ status: 200 });
}



