<script lang="ts">
	import { Logger } from '$lib/logging/logger';
	import { myRentalsState } from '$lib/state/my-rentals-state.svelte';
	import { onMount } from 'svelte';

	interface PhotoProps {
		cacheKey?: string;
		fetchUrl?: string;
		imageUrl?: string;
		photoName?: string;
	}

	let { cacheKey, fetchUrl, imageUrl, photoName }: PhotoProps = $props();

	let rentalPhotos = $derived(myRentalsState.rentalPhotos);

	let photo: string | null = $state(imageUrl || null);

	let fetchingImage = $state(true);

	async function fetchImage(): Promise<void> {
		if (imageUrl) {
			photo = imageUrl;
			fetchingImage = false;
			return;
		}

		if (!fetchUrl) {
			fetchingImage = false;
			return;
		}

		const cachedUrl = cacheKey ? rentalPhotos.get(cacheKey) : null;

		if (cachedUrl) {
			photo = cachedUrl;
			fetchingImage = false;
			return;
		} else {
			fetchingImage = true;

			const response = await fetch(fetchUrl);

			if (response.ok) {
				const photoUrl = await response.text();

				if (photoUrl) {
					if (cacheKey) {
						rentalPhotos.set(cacheKey, photoUrl);
					}

					photo = photoUrl;
				}
			}

			fetchingImage = false;
		}
	}

	async function handlePhotoError(): Promise<void> {
		Logger.debug(`Error fetching photo, possibly expired, re-fetching...`);

		if (cacheKey) {
			rentalPhotos.delete(cacheKey);
		}

		await fetchImage();
	}

	onMount(async () => {
		await fetchImage();
	});
</script>

<section>
	{#if fetchingImage}
		<p class="loading">Loading...</p>
	{:else}
		<img src={photo} alt={`Item ${photoName}`} onerror={handlePhotoError} />
	{/if}
</section>

<style lang="scss">
	section {
		height: 100%;
		width: 100%;
		position: relative;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	p.loading {
		font-size: 0.75rem;
	}

	img {
		max-height: 100%;
		max-width: 100%;
		border-radius: 0.25rem;
	}
</style>
