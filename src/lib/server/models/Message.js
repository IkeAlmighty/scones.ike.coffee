import mongoose from 'mongoose';
import { formatPhoneNumber } from '$lib/utils.js';

const messageSchema = new mongoose.Schema({
	from: { type: String, required: true },
	to: { type: String, required: true },
	body: { type: String, required: true },
	timestamp: { type: Date, default: Date.now }
});

messageSchema.pre('save', function (next) {
	if (this.from) {
		this.from = formatPhoneNumber(this.from);
	}
	if (this.to) {
		this.to = formatPhoneNumber(this.to);
	}
	next();
});

export default mongoose.models.Message || mongoose.model('Message', messageSchema);
