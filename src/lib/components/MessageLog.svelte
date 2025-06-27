<script>
	import { onMount } from 'svelte';

	let messages = [];
	export let phoneNumber;

	onMount(() => {
		// setInterval(updateMessages, 1000);
		async function updateMessages() {
			console.log(phoneNumber);
			const response = await fetch(`/api/twilio?phoneNumber=${encodeURIComponent(phoneNumber)}`);
			const data = await response.json();
			messages = data.messages;
		}

		updateMessages();
	});
</script>

{phoneNumber}
{#each messages as message}
	<div class={`${message.direction === 'inbound' ? 'their-messages' : 'my-messages'}`}>
		{message.body}
	</div>
{/each}

<style>
	.my-messages {
		text-align: right;
	}

	.their-messages {
		text-align: left;
	}
</style>
