<script lang="ts">
	import StuffPhoto from '$lib/photo/components/StuffPhoto.svelte';
	import type { StuffSocial } from '../model/stuff';

	interface StuffSearchSocialCardProps {
		social: StuffSocial;
	}

	let { social }: StuffSearchSocialCardProps = $props();

	function hanleArticleClick(evt: Event): void {
		const target = evt.target as HTMLElement;
		target?.scrollIntoView({ behavior: 'smooth', inline: 'center' });
	}
</script>

<article>
	<h3>
		<span
			>{social?.renteeName}
			{social?.currentlyRenting ? `is renting` : `rented`}
			{`${social?.renterName}'s`}</span
		>

		<span>{social?.itemName}</span>
		{#if !social?.currentlyRenting}
			<span
				>on {social?.returnDate
					? new Date(social?.returnDate).toLocaleDateString()
					: new Date().toLocaleDateString()}</span
			>
		{/if}
	</h3>

	<section class="photo">
		<StuffPhoto imageUrl={social?.image} photoName={social?.itemName} />
	</section>

	<button type="button" aria-label="Select" onclick={hanleArticleClick}></button>
</article>

<style lang="scss">
	@use '../../../lib/styles/overlay/shadows.scss';
	@use '../../../lib/styles/responsive.scss';

	article {
		position: relative;
		height: 100%;
		min-height: 100%;
		max-height: 100%;
		border-radius: 0.25rem;
		overflow: hidden;
		display: flex;
		flex-direction: column;
		align-items: center;
		text-align: center;

		@include shadows.boxShadow;

		h3 {
			font-size: 1rem;
			margin-bottom: 0;
			position: relative;
			z-index: 1;
			max-width: 90%;
			max-height: 3rem;
			overflow: hidden;
			white-space: nowrap;
			text-overflow: ellipsis;
		}

		section.photo {
			margin-top: 1rem;
			width: 6rem;
			max-width: 6rem;
			height: 6rem;
			max-height: 6rem;
			border-radius: 0.25rem;
			position: relative;
			z-index: 1;
		}

		button {
			position: absolute;
			top: 0;
			left: 0;
			height: 100%;
			width: 100%;
			border: none;
			background-color: white;
		}
	}

	@media screen and (max-width: responsive.$mini-width) {
		article {
			section.photo {
				width: 4rem;
				height: 4rem;
				max-width: 4rem;
				max-height: 4rem;
				min-width: 4rem;
				min-height: 4rem;
			}
		}
	}
</style>
