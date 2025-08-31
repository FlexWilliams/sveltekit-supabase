<script lang="ts">
	import { myRentalsState } from '$lib/state/my-rentals-state.svelte';
	import { untrack } from 'svelte';

	interface PhotoProps {
		cacheKey?: string;
		fetchUrl?: string;
		imageUrl?: string;
		photoName?: string;
	}

	let { cacheKey, fetchUrl, imageUrl, photoName }: PhotoProps = $props();

	let rentalPhotos = $derived(myRentalsState.rentalPhotos);

	let photo: string | null = $state(imageUrl || null);

	$effect(() => {
		if (photo !== null) {
			untrack(() => {
				if (photo) {
				}
			});
		}
	});

	async function fetchImage(): Promise<string | null> {
		if (imageUrl) {
			return imageUrl;
		}

		if (!fetchUrl) {
			return '';
		}

		const cachedUrl = cacheKey ? rentalPhotos.get(cacheKey) : null;

		if (cachedUrl) {
			return cachedUrl;
		} else {
			const response = await fetch(fetchUrl);

			if (response.ok) {
				const photoUrl = await response.text();

				if (photoUrl) {
					if (cacheKey) {
						rentalPhotos.set(cacheKey, photoUrl);
					}

					return photoUrl;
				}
			}
		}

		return null;
	}
</script>

<section>
	{#await fetchImage()}
		<p class="loading">Loading...</p>
	{:then _photo}
		<img src={_photo} alt={`Item ${photoName}`} />
	{/await}
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
