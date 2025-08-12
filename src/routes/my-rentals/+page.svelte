<script lang="ts">
	import { Logger } from '$lib/logging/logger';
	import MyRentalCard from '$lib/rental/component/MyRentalCard.svelte';
	import type { MyRental } from '$lib/rental/model/rental';
	import { ToastrService } from '$lib/toastr/services/ToastrService';
	import { onMount } from 'svelte';

	let loading = $state(true);

	let rentals: MyRental[] = $state([]);

	async function handleCancelReservation(id?: number): Promise<void> {
		const response = await fetch(`/api/my-rentals/${id}`, {
			method: 'DELETE'
		});

		if (response.ok) {
			await fetchRentals();
			ToastrService.alert(`Your reservation was\nCancelled!`);
		} else {
			Logger.error(`There was an error deleting My Rental w/id ${id}`);
		}
	}

	async function fetchRentals(): Promise<void> {
		const response = await fetch(`/api/my-rentals`);

		if (!response.ok) {
			Logger.error(`Error fetching my rentals!`);
		} else {
			rentals = (await response.json()) as MyRental[];
		}

		loading = false;
	}

	onMount(async () => {
		await fetchRentals();
	});
</script>

<section>
	<h2>My Rentals</h2>

	{#if loading}
		<p>Loading...</p>
	{:else}
		<ul>
			{#each rentals as rental}
				<li>
					<MyRentalCard {rental} {handleCancelReservation} />
				</li>
			{:else}
				<li>
					<p>You don't have any active rentals</p>
					<a href="/search">Search for things to rent here</a>
				</li>
			{/each}
		</ul>
	{/if}
</section>

<style lang="scss">
	@use '../../lib/styles/layout/panel.scss';

	section {
		@include panel.panel;

		h2 {
			text-align: center;
		}

		p {
			text-align: center;
		}

		ul {
			list-style: none;
			margin: 0;
			padding: 0;

			li {
				margin: 0;
				padding: 0 1rem;

				a {
					display: flex;
					justify-content: center;
					color: black;
				}
			}
		}
	}
</style>
