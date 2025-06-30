<script>
	import UserNavBar from '$lib/components/UserNavBar.svelte';

	export let data;

	let notificationConsent = data.notificationConsent;

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

	{#if data.user.isAdmin}
		<div>
			<a href="/account/admin">go to message center</a>
		</div>
	{/if}
</div>

<style>
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
