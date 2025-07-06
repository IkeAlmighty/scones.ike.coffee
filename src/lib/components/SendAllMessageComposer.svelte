<script>
	import { formatPhoneNumber } from '$lib/utils.js';

	let to = '';
	let statusMessage = '';

	let sendToAll = true;

	async function sendSMS(e) {
		statusMessage = '';
		e.target.value = 'Sending...';
		e.target.disabled = true;

		// parse phone numbers into list:
		let numbers;
		if (!sendToAll) {
			numbers = to.split(',').map((n) => formatPhoneNumber(n));
		}

		try {
			const res = await fetch('/api/twilio/send-referral-link', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ numbers, sendToAll })
			});

			const data = await res.json();

			if (res.ok) {
				statusMessage = `✅ Message sent (SID LIST: ${JSON.stringify(data.sidList)})`;
			} else {
				statusMessage = `❌ Error: ${data.error}`;
			}
		} catch (err) {
			statusMessage = `❌ Failed to send: ${err.message}`;
		}

		e.target.value = 'Send SMS';
		e.target.disabled = false;
	}
</script>

<div>
	<h1>Custom Message Sender</h1>

	<div>
		<label>
			<span>Send to All</span>
			<input type="checkbox" checked={sendToAll} on:change={() => (sendToAll = !sendToAll)} />
		</label>
	</div>

	<form on:submit={(e) => e.preventDefault()}>
		{#if !sendToAll}
			<label>
				<div>Phone Number(s):</div>
				<input type="text" bind:value={to} placeholder="+13334873472, +12223334444" required />
			</label>
		{/if}

		<br />
		<div>The message sent by custom message sender is hardcoded into the backend.</div>

		<input type="submit" on:click={sendSMS} value="Send SMS" />
	</form>

	<p>{statusMessage}</p>
</div>

<style>
	form label {
		display: block;
		margin: 1rem 0;
	}

	form label :not(div) {
		width: calc(100% - 1.25rem);
		padding: 0.5rem;
		margin: 1rem 0;
		font-size: 1rem;
	}

	input[type='submit'] {
		margin: 3rem 0;
		background: linear-gradient(135deg, #7f5af0, #2cb67d);
		color: white;
		padding: 0.75rem 1.5rem;
		font-size: 1.1rem;
		border: none;
		border-radius: 0.5rem;
		cursor: pointer;
		box-shadow:
			0 0 10px #7f5af0,
			0 0 20px #2cb67d;
		transition:
			transform 0.2s ease,
			box-shadow 0.2s ease;
		position: relative;
		overflow: hidden;
	}

	input[type='submit']::before {
		content: '';
		position: absolute;
		top: -50%;
		left: -50%;
		width: 200%;
		height: 200%;
		background: radial-gradient(circle, rgba(255, 255, 255, 0.3) 0%, transparent 60%);
		transform: rotate(45deg);
		pointer-events: none;
	}

	input[type='submit']:hover {
		transform: scale(1.05);
		box-shadow:
			0 0 20px #7f5af0,
			0 0 40px #2cb67d;
	}

	input[type='submit']:active {
		transform: scale(0.98);
		box-shadow:
			0 0 5px #7f5af0,
			0 0 10px #2cb67d;
	}
</style>
