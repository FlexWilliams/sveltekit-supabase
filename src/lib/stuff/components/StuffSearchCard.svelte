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
				photo = await response.text();
			}
		}
	}

	function handleScrollToItem(evt: Event): void {
		const target = evt.target as HTMLElement;
		target?.scrollIntoView({ behavior: 'smooth', inline: 'center' });
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
	<p>{stuff?.description}</p>
	<button onclick={() => goto(`/friend-stuff/${stuff?.id}`)} class="rent">Rent</button>

	<img src={photo || bluray} alt={`${stuff.name}`} />
	<button aria-label="Scroll to item" class="scroll-to" onclick={handleScrollToItem}></button>
</article>

<style lang="scss">
	@use '../../../lib/styles/overlay/shadows.scss';

	article {
		padding: 0 1rem;
		display: flex;
		flex-direction: column;
		align-items: center;
		position: relative;
		border: 1px solid black;
		min-height: 100%;
		border-radius: 0.25rem;

		@include shadows.boxShadow;

		h3 {
			text-align: center;
			display: flex;
			flex-direction: column;
			align-items: center;
			margin-bottom: 0;
		}

		p {
			text-align: center;
			overflow: hidden;
			white-space: nowrap;
			text-overflow: ellipsis;
			width: 100%;
		}

		img {
			max-width: 100%;
			max-height: 100%;
			opacity: 0.2;
			position: absolute;
		}

		button.scroll-to {
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
			border: none;
			background-color: transparent;
			z-index: 1;
		}

		button.rent {
			position: absolute;
			bottom: 1rem;
			right: 1rem;
			z-index: 2;
			width: 6rem;
			height: 2rem;
			border: none;
			border-radius: 0.25rem;
			background-color: #cddc39;
		}
	}
</style>
