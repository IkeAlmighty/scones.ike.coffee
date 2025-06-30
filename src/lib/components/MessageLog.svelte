<script>
	import { onMount } from 'svelte';
	import RefreshIcon from './RefreshIcon.svelte';

	let messages = [];
	let messagePolling = false;
	let consentingUsers = [];
	let selectedPhoneNumber;

	async function updateMessages() {
		const response = await fetch(
			`/api/twilio/read-sms?phoneNumber=${encodeURIComponent(selectedPhoneNumber)}`
		);
		const data = await response.json();
		messages = data.messages;
	}

	async function updatePhoneNumbers() {
		const response = await fetch(`/api/users/phone-numbers`);
		const data = await response.json();
		consentingUsers = data.users;
	}

	function setSelectedPhoneNumber(e) {
		selectedPhoneNumber = e.target.value.split('|')[1].trim();
		updateMessages();
	}

	onMount(() => {
		setInterval(() => {
			if (messagePolling) updateMessages();
		}, 1000);

		updatePhoneNumbers();
	});
</script>

{#if !messagePolling}
	<button id="refresh-btn" on:click={updateMessages}><RefreshIcon /></button>
{/if}

<input
	type="checkbox"
	checked={messagePolling}
	value={messagePolling}
	on:change={() => (messagePolling = !messagePolling)}
/>
auto refresh messages

<div>
	<select on:change={setSelectedPhoneNumber}>
		<option>Select a User</option>
		{#each consentingUsers as user}
			<option>{user.username} | {user.phone}</option>
		{/each}
	</select>
</div>

<hr />
{#each messages as message}
	<div class={`${message.direction === 'inbound' ? 'their-messages' : 'my-messages'}`}>
		{message.body}
	</div>
{/each}

<style>
	#refresh-btn {
		width: 1.2rem;
		background-color: inherit;

		border: solid black 1px;
	}
	.my-messages {
		padding-left: 30%;
		margin: 2rem 0;
	}

	.their-messages {
		padding-right: 30%;
		margin: 2rem 0;
	}

	button {
		border: none;
		background-color: none;
		cursor: pointer;
		display: block;
	}
</style>
