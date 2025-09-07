<script lang="ts">
	import { goto } from '$app/navigation';
	import { Logger } from '$lib/logging/logger.js';
	import type { PhotoNameAndUrl } from '$lib/photo/model/photo.js';
	import StuffForm from '$lib/stuff/components/StuffForm.svelte';
	import type { Stuff } from '$lib/stuff/model/stuff.js';
	import { ToastrService } from '$lib/toastr/services/ToastrService.js';
	import type { PhotoNamesResponse } from '$lib/web/http/response.js';
	import { onMount } from 'svelte';

	let { data } = $props();

	let photos: PhotoNameAndUrl[] = $state([]);

	let photoToRemove: string | null = $state(null);

	let stuff = $derived.by(() => (data.stuff.length > 0 ? data.stuff[0] : ({} as Stuff)));

	function showPopover(): void {
		document.getElementById(`remove-stuff-confirmation`)?.showPopover();
	}

	function closePopover(id: string): void {
		document.getElementById(id)?.hidePopover();
	}

	function handleRemoveStuffNo(): void {
		closePopover(`remove-stuff-confirmation`);
	}

	async function handleRemoveStuffYes(): Promise<void> {
		const params = window.location.pathname.split('/');
		const stuffId = params[params.length - 1];

		const removed = await fetch(`/api/my-stuff/${stuffId}`, {
			method: 'DELETE'
		});

		if (removed.ok && removed.status === 204) {
			closePopover(`remove-stuff-confirmation`);

			ToastrService.alert(`Item removed`);

			goto('/my-stuff');
		} else {
			Logger.error(`Error removing the item with id: ${stuffId}`);
		}
	}

	async function handleUpdate(): Promise<void> {
		await fetchImages();
	}

	async function fetchImages(): Promise<void> {
		photos.length = 0;

		const { photoNames } = (await (
			await fetch(`/api/stuff/${stuff?.id}/photo-names`)
		).json()) as PhotoNamesResponse;

		if (photoNames.length > 0) {
			photoNames.forEach(async (photoName) => {
				const photoUrl = await (await fetch(`/api/stuff/${stuff?.id}/photo/${photoName}`)).text();

				if (photoUrl) {
					photos.push({
						photoName,
						photoUrl
					});
				}
			});
		}
	}

	function handleRemovePhotoNo(): void {
		closePopover(`remove-photo-confirmation`);
	}

	async function handleRemovePhotoYes(): Promise<void> {
		if (photoToRemove) {
			await removePhoto(photoToRemove);
		}
	}

	async function removePhoto(photoName: string): Promise<void> {
		const response = await fetch(`/api/stuff/${stuff?.id}/photo/${photoName}`, {
			method: 'DELETE'
		});

		if (response?.ok) {
			closePopover(`remove-photo-confirmation`);

			ToastrService.alert(`Photo removed!`);

			await fetchImages();
		}
	}

	function confirmRemovePhoto(photoName: string): void {
		photoToRemove = photoName;

		document.getElementById(`remove-photo-confirmation`)?.showPopover();
	}

	onMount(async () => {
		await fetchImages();
	});
</script>

<section>
	<h2>{stuff?.name}</h2>

	<StuffForm
		{stuff}
		{photos}
		handleRemove={showPopover}
		{handleUpdate}
		removePhoto={confirmRemovePhoto}
	/>

	<dialog id="remove-stuff-confirmation" popover="auto">
		<h3>Are you sure you want to delete this item?</h3>
		<button onclick={handleRemoveStuffNo}>Cancel</button>
		<button onclick={handleRemoveStuffYes}>Yes</button>
	</dialog>

	<dialog id="remove-photo-confirmation" popover="auto">
		<h3>Are you sure you want to delete this photo?</h3>
		<button onclick={handleRemovePhotoNo}>Cancel</button>
		<button onclick={handleRemovePhotoYes}>Yes</button>
	</dialog>

	<a href="/my-stuff" aria-label="Back to My Stuff page" class="close">X</a>
</section>

<style lang="scss">
	@use '../../../lib/styles/forms/forms.scss';
	@use '../../../lib/styles/layout/panel.scss';
	@use '../../../lib/styles/responsive.scss';

	section {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;

		h2 {
			@include forms.form_header;
		}

		a.close {
			@include panel.panel_close_button_link;
		}
	}

	@media screen and (min-width: responsive.$tablet-width) {
		section {
			h2 {
				font-size: 2.5rem;
				margin-top: 2rem;
			}
			a.close {
				width: 5rem;
				height: 5rem;
				font-size: 1rem;
			}
		}
	}
</style>
