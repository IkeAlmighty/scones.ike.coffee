<!-- 
 
need:
 - image storage system
 - form for submitting an image
 - a way for me to delete (moderate) images I don't like
-->

<script>
	import BulletinBoard from '$lib/components/BulletinBoard.svelte';
	import FileUploadButton from '$lib/components/FileUploadButton.svelte';
	import TrashIcon from './TrashIcon.svelte';
	import { onMount } from 'svelte';

	let imageSources = [];

	function sortSources() {
		imageSources.sort().reverse();
	}

	$: imageSources && sortSources();

	onMount(async () => {
		imageSources = await getImageSources();
	});

	async function getImageSources() {
		const listFilesResponse = await fetch('/api/bulletinboard/list-all');
		const { files, downloadUrl } = await listFilesResponse.json();
		const sources = files.map((file) => ({
			src: `${downloadUrl}/file/scones-ike-coffee/${file.fileName}`,
			fileId: file.fileId,
			fileName: file.fileName
		}));

		return sources;
	}

	async function updateImageSources(files) {
		if (!files) return; // return if no files were selected

		// update ui:
		const newSrc = URL.createObjectURL(files[0]);
		imageSources = [newSrc, ...imageSources];

		// update the backend database:
		const formData = new FormData();
		formData.append('file', files[0]);

		// upload the formdata object wrapping the file selected
		const uploadFilesResponse = await fetch('/api/bulletinboard/upload', {
			method: 'POST',
			body: formData
		});

		if (!uploadFilesResponse.ok) {
			alert('file upload failed on backend.');
		}
	}

	async function deleteImageFromBucket(e, { fileName, fileId }) {
		e.stopPropogation();
		const deleteFileResponse = await fetch(
			`/api/bulletinboard/delete?fileName=${fileName}&fileId=${fileId}`,
			{ method: 'DELETE' }
		);

		if (!deleteFileResponse.ok) {
			console.log(deleteFileResponse.status);
		}
	}

	function toggleTrashButton(event) {
		const image = event.currentTarget.children[0];
		const button = event.currentTarget.children[1];
		button.classList.toggle('fade-in');
		button.classList.toggle('fade-out');

		if (image.style.opacity < 1) {
			button.setAttribute('disabled', true);
		} else {
			button.setAttribute('disabled', false);
		}
	}
</script>

<div id="bulletin-header-container">
	<h2>Public Bulletin Board</h2>
	<FileUploadButton onUpload={updateImageSources} />
</div>
<div id="bulletin-image-container">
	{#each imageSources as imageData}
		<button on:click={toggleTrashButton}>
			<img src={imageData.src} alt="bulletin board post" />
			<button
				disabled={true}
				class="trash-button fade-out"
				on:click={(e) => deleteImageFromBucket(e, imageData)}><TrashIcon /></button
			>
		</button>
	{/each}
</div>

<style>
	img {
		max-width: 300px;
		margin: 1%;
	}

	#bulletin-image-container {
		margin: auto auto;
		display: flex;
		justify-content: space-evenly;
		align-items: center;
		flex-wrap: wrap;
		background-color: black;
		color: white;
	}

	#bulletin-image-container > button {
		position: relative;
		padding: 0;
		margin: 0;
		background-color: inherit;
	}

	#bulletin-image-container > button:active {
		border-style: outset;
	}

	#bulletin-header-container {
		background-color: white;
		color: black;
		border: 5px black solid;
		border-top-left-radius: 10px;
		border-top-right-radius: 10px;
		padding: 1rem;
	}

	.trash-button {
		/* display: none; */
		position: absolute;
		height: 50px;
		width: 50px;
		top: calc(50% - 25px);
		left: calc(50% - 25px);
		background-color: white;
	}

	.fade-in {
		opacity: 1;
		transition: opacity 1s ease-in;
		/* z-index: 1; */
	}

	.fade-out {
		opacity: 0;
		transition: opacity 1s ease-out;
		/* z-index: -1; */
	}
</style>
