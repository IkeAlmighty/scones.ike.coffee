<script>
	import { onMount, tick } from 'svelte';
	import RefreshIcon from './RefreshIcon.svelte';
	import { formatPhoneNumber } from '$lib/utils.js';

	let body = '';
	let statusMessage = '';
	let sendToAll = false;
	let messages = [];
	let messagePolling = false;
	let consentingUsers = [];
	let selectedUser;
	let messageContainer;

	onMount(() => {
		setInterval(() => {
			if (messagePolling) updateMessages();
		}, 1000);

		updatePhoneNumbers();
	});

	async function updateMessages() {
		if (!selectedUser) return;
		const res = await fetch(
			`/api/twilio/read-sms?phoneNumber=${encodeURIComponent(selectedUser.phone)}`
		);
		const data = await res.json();
		messages = data.messages;

		await tick();
		if (messageContainer) {
			messageContainer.scrollTop = messageContainer.scrollHeight;
		}
	}

	async function updatePhoneNumbers() {
		const res = await fetch(`/api/users/phone-numbers`);
		const data = await res.json();
		consentingUsers = data.users;
	}

	function setSelectedPhoneNumber(e) {
		if (e.target.value === 'Select a User') return (selectedUser = undefined);
		let phone = e.target.value.split('|')[1].trim();
		selectedUser = consentingUsers.find((u) => u?.phone == phone);
		updateMessages();
	}

	async function sendSMS(e) {
		statusMessage = '';
		e.target.value = 'Sending...';
		e.target.disabled = true;

		const numbers = [selectedUser?.phone];

		try {
			const res = await fetch('/api/twilio/send-sms', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ numbers, body, sendToAll })
			});
			const data = await res.json();

			statusMessage = res.ok
				? `✅ Message sent (SID LIST: ${JSON.stringify(data.sidList)})`
				: `❌ Error: ${data.error}`;
		} catch (err) {
			statusMessage = `❌ Failed to send: ${err.message}`;
		}

		e.target.value = 'Send SMS';
		e.target.disabled = false;
	}
</script>

<div>
	<h1>Send SMS via Twilio</h1>

	{#if !messagePolling}
		<button id="refresh-btn" on:click={updateMessages} title="Manual refresh">
			<RefreshIcon />
		</button>
	{/if}

	<label>
		<input
			type="checkbox"
			checked={messagePolling}
			on:change={() => (messagePolling = !messagePolling)}
		/>
		auto refresh messages
	</label>

	<div>
		<select on:change={setSelectedPhoneNumber}>
			<option>Select a User</option>
			{#each consentingUsers as user}
				<option>{user.username} | {user.phone}</option>
			{/each}
		</select>
	</div>

	<hr />

	{#if !sendToAll && selectedUser}
		<!-- Scrollable message log -->
		<div class="message-log" bind:this={messageContainer}>
			{#each messages as message}
				<div
					class={`${parseInt(message.from) === parseInt(selectedUser.phone) ? 'my-messages' : 'their-messages'}`}
				>
					<span class="message">
						{@html message.body.replace(/\n/g, '<br/>')}
					</span>
				</div>
			{/each}
		</div>
	{/if}

	<div>
		<label>
			<span>Send to All</span>
			<input type="checkbox" checked={sendToAll} on:change={() => (sendToAll = !sendToAll)} />
		</label>
	</div>

	<form on:submit|preventDefault={() => {}}>
		<label>
			<div>Message to {sendToAll ? 'EVERYONE' : selectedUser?.username}:</div>
			<textarea bind:value={body} required></textarea>
		</label>

		<input type="submit" value="Send SMS" on:click={sendSMS} />
	</form>

	<p>{statusMessage}</p>
</div>

<style>
	#refresh-btn {
		width: 1.5rem;
		height: 1.5rem;
		background: none;
		border: 1px solid black;
		cursor: pointer;
		margin-bottom: 0.5rem;
	}

	.message-log {
		height: 50vh;
		overflow-y: auto;
		border: 1px solid #ccc;
		padding: 1rem 0;
		margin: 1rem 0;
		border-radius: 0.5rem;
		background-color: #f9f9f9;
	}

	.message {
		padding: 0.5rem 0.5rem;
		margin: 1px 0;
		border-radius: 1rem;
	}

	.my-messages {
		text-align: right;
		line-height: 2.4rem;
	}

	.their-messages {
		text-align: left;
		line-height: 2.4rem;
	}

	.their-messages span {
		background-color: lightgreen;
	}

	.my-messages span {
		background-color: lightblue;
	}

	form label {
		display: block;
		margin: 1rem 0;
	}

	form label :not(div) {
		width: calc(100% - 1.25rem);
		padding: 0.5rem;
		font-size: 1rem;
	}

	textarea {
		min-height: 2rem;
		resize: vertical;
		width: 100%;
	}

	input[type='submit'] {
		margin: 2rem 0;
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

	button {
		background: none;
		border: none;
		cursor: pointer;
	}
</style>
