import { User } from '$lib/server/models/User';

/** @type {import('./$types').PageLoad} */
export async function load({ url }) {
	const referralId = url.searchParams.get('referral');
	if (referralId) {
		const user = await User.findById(referralId);

		return { referral: { username: user.username, id: user.id } };
	}
}
