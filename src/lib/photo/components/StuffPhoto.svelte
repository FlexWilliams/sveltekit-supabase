<script lang="ts">
	import defaultPhoto from '$lib/assets/images/default-photo.svg';
	import gear from '$lib/assets/images/gear.svg';
	import { myRentalsState } from '$lib/state/my-rentals-state.svelte';
	import { untrack } from 'svelte';

	interface PhotoProps {
		cacheKey: number;
		fetchUrl: string;
		photoName?: string;
	}

	let { cacheKey, fetchUrl, photoName }: PhotoProps = $props();

	let rentalPhotos = $derived(myRentalsState.rentalPhotos);

	let photo: string | null = $state(null);

	$effect(() => {
		if (photo !== null) {
			untrack(() => {
				if (photo) {
				}
			});
		}
	});

	async function fetchImage(): Promise<string | null> {
		const cachedUrl = rentalPhotos.get(cacheKey);

		if (cachedUrl) {
			return cachedUrl;
		} else {
			const response = await fetch(fetchUrl);

			if (response.ok) {
				const photoUrl = await response.text();

				if (photoUrl) {
					rentalPhotos.set(cacheKey, photoUrl);
					return photoUrl;
				}
			}
		}

		return null;
	}
</script>

<section>
	{#await fetchImage()}
		<img class="loader" src={gear} alt={'Loading indicator'} />
	{:then _photo}
		<img src={_photo || defaultPhoto} alt={`Item ${photoName}`} />
	{/await}
</section>

<style lang="scss">
	@use '../../styles/animations/spin.scss';

	section {
		height: 100%;
		width: 100%;
		position: relative;
	}

	img {
		max-height: 100%;
		max-width: 100%;
	}

	img.loader {
		@include spin.spin360;
	}
</style>
