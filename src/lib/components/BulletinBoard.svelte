<!-- 
 
need:
 - image storage system
 - form for submitting an image
 - a way for me to delete (moderate) images I don't like
-->

<script>
	import { onMount } from 'svelte';

	export let getImageSources = () => [];
	let imageLinks = [];

	onMount(async () => {
		imageLinks = await getImageSources();
	});
</script>

{#each imageLinks as src}
	<img {src} alt="bulletin board post" />
{/each}
