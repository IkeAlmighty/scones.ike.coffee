<script>
	import UserNavBar from '$lib/components/UserNavBar.svelte';

	export let data;
</script>

<UserNavBar />
<h1>{data.user.username}</h1>

(this page is still in progress)
