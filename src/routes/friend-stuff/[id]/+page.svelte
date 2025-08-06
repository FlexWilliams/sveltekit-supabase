<script lang="ts">
	import { goto } from '$app/navigation';
	import { Logger } from '$lib/logging/logger';
	import type { MyRental } from '$lib/rental/model/rental';
	import type { Stuff } from '$lib/stuff/model/stuff';
	import { ToastrService } from '$lib/toastr/services/ToastrService';
	import { onMount } from 'svelte';

	let loadingStuff = $state(true);

	let loadingMyRental = $state(true);

	let stuffId: string | null = $state(null);

	let stuff: Stuff | null = $state(null);

	let rental: MyRental | null = $state(null);

	async function fetchStuff(): Promise<void> {
		const response = await fetch(`/api/friend-stuff/${stuffId}`);

		if (!response.ok) {
			Logger.error(`Stuff with id ${stuffId} not found!`);
		} else {
			stuff = (await response.json()) as Stuff;
		}

		loadingStuff = false;
	}

	async function fetchRental(): Promise<void> {
		const response = await fetch(`/api/my-rentals/${stuffId}`);

		if (response.ok) {
			rental = (await response.json()) as MyRental;
		}

		loadingMyRental = false;
	}

	async function handleRentClick(): Promise<void> {
		const rentalResponse = await fetch('/api/my-rentals', {
			method: 'POST',
			body: JSON.stringify({ id: stuff?.id }),
			headers: {
				'Content-Type': 'application/json'
			}
		});

		if (rentalResponse.ok) {
			ToastrService.alert(`Item Added to My Rentals.\nAwaiting approval!`);
			goto('/my-rentals');
		} else {
			Logger.error(`There was an error renting this item!`);
		}
	}

	function closePopover(): void {
		const popover = document.getElementById('confirm-cancellation') as HTMLDialogElement;
		if (popover) {
			popover.hidePopover();
		}
	}

	async function handleCancelReservation(id?: number): Promise<void> {
		const response = await fetch(`/api/my-rentals/${id}`, {
			method: 'DELETE'
		});

		if (response.ok) {
			ToastrService.alert(`Your reservation was\nCancelled!`);
			goto('/my-rentals');
		} else {
			Logger.error(`There was an error deleting My Rental w/id ${id}`);
		}
	}

	onMount(async () => {
		let tokens = window.location.pathname.split('/');
		stuffId = tokens[tokens.length - 1];
		await fetchStuff();
		await fetchRental();
	});
</script>

{#if loadingStuff || loadingMyRental}
	<p>Loading...</p>
{:else if stuff}
	<h3>
		<span>{stuff?.userMeta ? `${stuff?.userMeta?.userName}'s` : ''} </span>
		<span>{stuff.name}</span>
	</h3>
	<p>{stuff.description}</p>

	<div class="rental-actions">
		<div>
			{#if rental && !rental.status}
				<button popovertarget="confirm-cancellation">Cancel Reservation</button>
			{/if}
		</div>
		<div>
			<button onclick={handleRentClick} disabled={loadingMyRental || !!rental}>Rent</button>
		</div>
	</div>
{:else}
	<p>Sorry, this item doesn't seem to exist!</p>
	<a href="/search">Back to Search</a>
{/if}

{#if rental}
	<dialog id="confirm-cancellation" popover="auto">
		<h3>
			<span>Are you sure you want to cancel your Reservation of:</span>
			<span>{rental?.itemName}?</span>
		</h3>
		<div class="actions">
			<button type="button" onclick={() => closePopover()}>No</button>
			<button
				type="button"
				class="confirm"
				onclick={() => {
					closePopover();
					handleCancelReservation(rental?.id);
				}}>Yes</button
			>
		</div>
	</dialog>
{/if}

<style lang="scss">
	@use '../../../lib/styles/dialog/dialog.scss';

	h3 {
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	p {
		text-align: center;
	}

	a {
		display: flex;
		justify-content: center;
		color: black;
	}

	div.rental-actions {
		display: flex;
		justify-content: space-between;

		div {
			min-width: 10rem;
		}

		button {
			width: 100%;
			height: 2rem;
		}
	}

	dialog {
		@include dialog.dialog;
	}
</style>
