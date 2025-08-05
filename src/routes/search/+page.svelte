<script lang="ts">
	import StuffSearchCard from '$lib/stuff/components/StuffSearchCard.svelte';
	import StuffSearchSocialCarousel from '$lib/stuff/components/StuffSearchSocialCarousel.svelte';
	import type { Stuff, StuffSocial } from '$lib/stuff/model/stuff';

	let stuff: Stuff[] = $state([]);

	let socials: StuffSocial[] = $state([
		{
			renterName: 'Alex',
			renteeName: 'Ian',
			itemName: 'Staple Gun',
			currentlyRenting: false,
			returnDate: new Date().toISOString()
		} as StuffSocial,
		{
			renterName: 'Ian',
			renteeName: 'Alfredo',
			itemName: 'Dirt Bike',
			currentlyRenting: true
		} as StuffSocial,
		{
			renterName: 'Alfredo',
			renteeName: 'Alex',
			itemName: 'Copper Mugs (Moscow Mule)',
			currentlyRenting: false,
			returnDate: new Date().toISOString()
		} as StuffSocial,
		{
			renterName: 'Ian',
			renteeName: 'Alex',
			itemName: 'Cat Camper',
			currentlyRenting: true
		} as StuffSocial,
		{
			renterName: 'Alfredo',
			renteeName: 'Ian',
			itemName: '2022 Macbook Pro',
			currentlyRenting: false,
			returnDate: new Date().toISOString()
		} as StuffSocial,
		{
			renterName: 'Alex',
			renteeName: 'Alfredo',
			itemName: 'XBOX Controller',
			currentlyRenting: true
		} as StuffSocial
	]);
</script>

<section>
	<form name="search-friend-stuff-form">
		<h2>Search</h2>
		<label for="search"></label>
		<input id="search" name="search" type="text" />
	</form>

	<div class="search-results">
		{#each stuff as s}
			<StuffSearchCard stuff={s} />
		{:else}
			<StuffSearchSocialCarousel {socials} />
		{/each}
	</div>
	<div class="social"></div>
</section>

<style lang="scss">
	section {
		display: flex;
		flex-direction: column;
		height: 100%;

		form {
			height: 20%;

			h2 {
				margin: 0;
				font-size: 1.25rem;
			}

			input {
				width: 100%;
				height: 2rem;
				border-radius: 0.25rem;
				border: none;
			}
		}

		div.search-results {
			height: 60%;
		}

		div.social {
			height: 20%;
		}
	}
</style>
