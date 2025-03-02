import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '$env/static/private';

class JWTService {
	static generateToken(user) {
		return jwt.sign(
			{
				_id: user._id,
				name: user.name,
				email: user.email,
				stripeCustomerId: user.stripeCustomerId
			},
			SECRET_KEY,
			{ expiresIn: '7d' } // Token expires in 7 days
		);
	}

	static verifyToken(token) {
		try {
			return jwt.verify(token, SECRET_KEY);
		} catch (error) {
			console.error('Invalid token:', error.message);
			return null;
		}
	}
}

export { JWTService };
