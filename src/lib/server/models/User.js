import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { ADMIN_NUMBER } from '$env/static/private';

const userSchema = new mongoose.Schema(
	{
		phone: { type: mongoose.Schema.Types.Number, required: true, unique: true },
		password: { type: String },
		username: { type: String },
		notificationConsent: { type: Boolean, required: true },
		referral: { type: mongoose.Schema.Types.ObjectId }
	},
	{ toJSON: { virtuals: true } }
);

// hash password as it is placed in database:
userSchema.pre('save', async function (next) {
	if (!this.isModified('password')) {
		return next();
	}

	try {
		const saltedPw = await bcrypt.hash(this.password, 10);
		this.password = saltedPw;

		next();
	} catch (error) {
		return next(error);
	}
});

userSchema.virtual('isAdmin').get(function () {
	return this.phone === parseInt(ADMIN_NUMBER);
});

// create instance method for validating password:
userSchema.methods.isValidPassword = async function (password) {
	if (!this.password) return false; // if the user hasn't set up a password, then don't try comparing as it will crash the server
	return await bcrypt.compare(password, this.password);
};

export const User = mongoose.models.User || mongoose.model('User', userSchema);
