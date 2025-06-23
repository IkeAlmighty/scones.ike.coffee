<script>
	let to = '';
	let body = '';
	let statusMessage = '';

	let sendToAll = true;

	async function sendSMS() {
		statusMessage = '';

		// parse phone numbers into list:
		const numbers = to.split(',').map((n) => n.trim());

		try {
			const res = await fetch('/api/twilio/send-sms', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ numbers, body, sendToAll })
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
	}
</script>

<div id="container">
	<h1>Send SMS via Twilio</h1>

	<div>
		<label>
			<span>Send to All</span>
			<input type="checkbox" checked={sendToAll} on:change={() => (sendToAll = !sendToAll)} />
		</label>
	</div>
	<form on:submit|preventDefault={sendSMS}>
		{#if !sendToAll}
			<label>
				<div>Phone Number(s):</div>
				<input type="text" bind:value={to} placeholder="+13334873472, +12223334444" required />
			</label>
		{/if}

		<label>
			<div id="message">Message:</div>
			<textarea bind:value={body} required></textarea>
		</label>

		<button type="submit">Send SMS</button>
	</form>

	<p>{statusMessage}</p>
</div>

<style>
	#container {
		max-width: 600px;
		margin: auto auto;
	}

	#message {
		display: block;
	}

	form label {
		display: block;
		margin: 1rem 0;
	}

	form label :not(div) {
		width: 400px;
		padding: 0.5rem;
	}

	textarea {
		height: 300px;
	}

	button {
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

	button::before {
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

	button:hover {
		transform: scale(1.05);
		box-shadow:
			0 0 20px #7f5af0,
			0 0 40px #2cb67d;
	}

	button:active {
		transform: scale(0.98);
		box-shadow:
			0 0 5px #7f5af0,
			0 0 10px #2cb67d;
	}
</style>
