import { JWTService } from '$lib/server/jwtService';
import jwt from 'jsonwebtoken';


// this attaches user data to each backend request
export async function handle({ event, resolve }) {
    const token = event.cookies.get("auth_token");

    if (token) {
        try {
            const { user } = JWTService.verifyToken(token);
            event.locals.user = user;
        } catch (error) {
            console.log('Invalid Token: ', error.message);
            event.locals.user = null;
        }
    } else {
        event.locals.user = null;
    }

    return resolve(event);
}