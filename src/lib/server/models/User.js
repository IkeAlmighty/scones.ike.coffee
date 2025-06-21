import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema({
	phone: { type: mongoose.Schema.Types.Number, required: true, unique: true },
	password: { type: String, required: true },
	username: { type: String, required: true }
});

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

// create instance method for validating password:
userSchema.methods.isValidPassword = async function (password) {
	return bcrypt.compare(password, this.password);
};

export const User = mongoose.models.User || mongoose.model('User', userSchema);
