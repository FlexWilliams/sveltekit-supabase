<script lang="ts">
	import StuffPhoto from '$lib/photo/components/StuffPhoto.svelte';
	import type { Stuff } from '../model/stuff';

	interface StuffSearchCardProps {
		stuff: Stuff;
	}

	let { stuff }: StuffSearchCardProps = $props();

	function handleScrollToItem(evt: Event): void {
		const target = evt.target as HTMLElement;
		target?.scrollIntoView({ behavior: 'smooth', inline: 'center' });
	}
</script>

<article>
	<h3>
		<span>{stuff?.userMeta ? `${stuff?.userMeta?.userName}'s` : ''}</span>
		<span> {stuff?.name}</span>
	</h3>

	<a href={`/friend-stuff/${stuff?.id}`} class="rent" aria-label={`Rent this ${stuff?.name}?`}
		>Rent</a
	>

	<section class="photo">
		<StuffPhoto
			cacheKey={`stuff-${stuff?.id}`}
			fetchUrl={`/api/stuff/${stuff?.id}/photo/${stuff.imageUrl}`}
			photoName={stuff.name}
		/>
	</section>

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

		section.photo {
			width: 6rem;
			height: 6rem;
			max-width: 6rem;
			max-height: 6rem;
			min-width: 6rem;
			min-height: 6rem;
			position: absolute;
			bottom: 1rem;
			left: 1rem;
			border-radius: 0.25rem;
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

		a.rent {
			// TODO: make link button style
			position: absolute;
			bottom: 1rem;
			right: 1rem;
			z-index: 2;
			width: 6rem;
			height: 2rem;
			border: none;
			border-radius: 0.25rem;
			color: black;
			background-color: #cddc39;
			text-decoration: none;
			display: flex;
			justify-content: center;
			align-items: center;
		}
	}
</style>
