<script>
	import MessageComposer from '$lib/components/SendAllMessageComposer.svelte';
	import MessageLog from '$lib/components/MessageLog.svelte';
	import MessagingComponent from '$lib/components/MessagingComponent.svelte';
	import SendAllMessageComposer from '$lib/components/SendAllMessageComposer.svelte';
</script>

<div class="page-container">
	<div>
		<MessagingComponent />
	</div>
	<hr />
	<div>
		<SendAllMessageComposer />
	</div>
</div>
