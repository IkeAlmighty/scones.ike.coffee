export function formatPhoneNumber(number) {
	let formatted = number.replace(/[^0-9+]/g, '');

	if (formatted.length === 10) return `+1${formatted}`;
	if (formatted.length === 11) return `+${formatted}`;

	return formatted;
}
