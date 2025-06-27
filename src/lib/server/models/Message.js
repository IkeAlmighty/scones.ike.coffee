import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
	from: { type: String, required: true },
	to: { type: String, required: true },
	body: { type: String, required: true },
	direction: { type: String, enum: ['inbound', 'outbound'], required: true },
	timestamp: { type: Date, default: Date.now }
});

function formatPhoneNumber(number) {
	console.log(number);
	let formatted = number.replace(/[^0-9+]/g, '');

	if (formatted.length === 10) return `+1${formatted}`
	if (formatted.length === 11) return `+${formatted}`

	return formatted;
}

messageSchema.pre('save', function (next) {
	console.log('running presave')
	if (this.from) {
		this.from = formatPhoneNumber(this.from);
	}
	if (this.to) {
		this.to = formatPhoneNumber(this.to);
	}
	next();
});

export default mongoose.models.Message || mongoose.model('Message', messageSchema);
