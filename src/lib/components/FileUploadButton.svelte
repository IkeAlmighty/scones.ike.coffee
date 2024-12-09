<script>
	export let onUpload = () => {
		throw Error('onUpload not defined for FileUploadButton');
	};

	let files;

	$: onUpload(files);
</script>

<input accept="image/png, image/jpeg" bind:files type="file" />

<style>
	input {
		margin-left: 3rem;
	}
</style>
