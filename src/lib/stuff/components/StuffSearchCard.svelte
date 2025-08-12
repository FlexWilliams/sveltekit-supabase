<script lang="ts">
	import { goto } from '$app/navigation';
	import bluray from '$lib/assets/images/inventory-items/bluray.png';
	import { onMount } from 'svelte';
	import type { Stuff } from '../model/stuff';

	interface StuffSearchCardProps {
		stuff: Stuff;
	}

	let { stuff }: StuffSearchCardProps = $props();

	let photo: string | null = $state(null);

	async function fetchPhoto(): Promise<void> {
		if (stuff?.imageUrl) {
			const response = await fetch(`/api/stuff/${stuff?.id}/photo/${stuff.imageUrl}`);

			if (response.ok) {
				const buffer = await response.arrayBuffer();
				photo = URL.createObjectURL(new Blob([buffer]));
			}
		}
	}

	onMount(async () => {
		await fetchPhoto();
	});
</script>

<article>
	<h3>
		<span>{stuff?.userMeta ? `${stuff?.userMeta?.userName}'s` : ''}</span>
		<span> {stuff?.name}</span>
	</h3>
	<img src={photo || bluray} alt={`${stuff.name}`} />
	<p>{stuff?.description}</p>
	<button onclick={() => goto(`/friend-stuff/${stuff?.id}`)}>Rent</button>
</article>

<style lang="scss">
	article {
		padding: 0 1rem;
		display: flex;
		flex-direction: column;
		align-items: center;

		h3 {
			text-align: center;
			display: flex;
			flex-direction: column;
			align-items: center;
		}

		img {
			max-width: 3rem;
			max-height: 3rem;
		}
	}
</style>
