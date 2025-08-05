<script lang="ts">
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
	<button type="button" aria-label="Select" onclick={hanleArticleClick}></button>
</article>

<style lang="scss">
	article {
		position: relative;
		height: 100%;

		h3 {
			display: flex;
			flex-direction: column;
			align-items: center;
			text-align: center;
		}

		button {
			position: absolute;
			top: 0;
			left: 0;
			height: 100%;
			width: 100%;
			border: none;
			background-color: transparent;
		}
	}
</style>
