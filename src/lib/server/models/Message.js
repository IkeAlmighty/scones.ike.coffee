import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
	from: { type: String, required: true },
	to: { type: String, required: true },
	body: { type: String, required: true },
	direction: { type: String, enum: ['inbound', 'outbound'], required: true },
	timestamp: { type: Date, default: Date.now }
});

export default mongoose.models.Message || mongoose.model('Message', messageSchema);
