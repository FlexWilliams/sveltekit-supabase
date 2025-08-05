<script lang="ts">
	import type { StuffSocial } from '../model/stuff';
	import StuffSearchSocialCard from './StuffSearchSocialCard.svelte';

	interface StuffSearchSocialCarouselProps {
		socials: StuffSocial[];
	}

	let { socials }: StuffSearchSocialCarouselProps = $props();
</script>

<h3>Your Friend Activity</h3>
<ul>
	{#each socials as social}
		<li>
			<StuffSearchSocialCard {social} />
		</li>
	{:else}
		<li class="no-friend-activity">
			<p>There is no friend activity to show :(</p>
			<p>Start some!</p>
		</li>
	{/each}
</ul>

<style lang="scss">
	h3 {
		text-align: center;
		margin-bottom: 0;
	}

	ul {
		list-style: none;
		margin: 1rem 0;
		padding: 1rem 0;
		height: calc(100% - 4rem);
		display: flex;
		overflow-x: auto;
		overflow-y: hidden;

		li {
			margin: 0;
			margin-right: 1rem;
			padding: 0;
			height: calc(100%);
			width: 80%;
			min-width: 80%;
			background-color: white;
			border-radius: 0.25rem;
		}

		li.no-friend-activity {
			display: flex;
			flex-direction: column;

			p {
				margin-bottom: 0;
				text-align: center;
			}
		}
	}
</style>
