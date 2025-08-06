<script lang="ts">
	import { goto } from '$app/navigation';
	import { Logger } from '$lib/logging/logger';
	import type { Stuff } from '$lib/stuff/model/stuff';
	import { ToastrService } from '$lib/toastr/services/ToastrService';
	import { onMount } from 'svelte';

	let loading = $state(true);

	let stuffId: string | null = $state(null);

	let stuff: Stuff | null = $state(null);

	async function fetchStuff(): Promise<void> {
		const response = await fetch(`/api/friend-stuff/${stuffId}`);

		if (!response.ok) {
			Logger.error(`Stuff with id ${stuffId} not found!`);
		} else {
			stuff = (await response.json()) as Stuff;
		}

		loading = false;
	}

	function handleRentClick(): void {
		ToastrService.alert(`Item Added to My Rentals.\nAwaiting approval!`);
		goto('/my-rentals');
	}

	onMount(async () => {
		let tokens = window.location.pathname.split('/');
		stuffId = tokens[tokens.length - 1];
		await fetchStuff();
	});
</script>

{#if loading}
	<p>Loading...</p>
{:else if stuff}
	<p>{stuff.name}</p>
	<p>{stuff.description}</p>
	<button onclick={handleRentClick}>Rent</button>
{:else}
	<p>Sorry, this item doesn't seem to exist!</p>
	<a href="/search">Back to Search</a>
{/if}

<style lang="scss">
	p {
		text-align: center;
	}

	a {
		display: flex;
		justify-content: center;
		color: black;
	}
</style>
