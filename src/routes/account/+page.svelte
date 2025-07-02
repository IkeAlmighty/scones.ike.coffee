<script>
	import UserNavBar from '$lib/components/UserNavBar.svelte';
	import { getReferralLinkFromId } from '$lib/utils.js';

	export let data;

	let notificationConsent = data.notificationConsent;

	let referralLink = getReferralLinkFromId(data.user.id);

	async function toggleNotificationConsent(e) {
		let prevState = e.target.innerHTML;
		e.target.innerHTML = 'Toggling...';
		e.target.disabled = true;

		try {
			const response = await fetch('/api/twilio/consent', { method: 'POST' });

			if (response.ok) {
				notificationConsent = !notificationConsent;
				e.target.innerHTML = `${notificationConsent ? 'Stop' : 'Start'} Text Notifications`;
			} else {
				e.target.innerHTML = prevState;
			}
		} catch (err) {
			console.log(err);
		}

		e.target.disabled = false;
	}
</script>

<UserNavBar />
<div id="container">
	<h1>{data.user.username} | Account Controls</h1>

	<button on:click={toggleNotificationConsent}>
		{notificationConsent ? 'Stop' : 'Start'} Text Notifications
	</button>

	<div>
		Your referral link for free scones: <a href={referralLink}>{referralLink}</a>
	</div>

	{#if data.user.isAdmin}
		<div>
			<a href="/account/admin">go to message center</a>
		</div>
	{/if}
</div>

<style>
	div {
		margin: 2rem 0;
	}

	#container {
		max-width: 500px;
		margin: auto auto;
	}

	button {
		font-size: 1rem;
		border-radius: 1rem;
		padding: 1rem 2rem;
	}
</style>
