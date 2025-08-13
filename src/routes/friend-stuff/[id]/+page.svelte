<script lang="ts">
	import { goto } from '$app/navigation';
	import bluray from '$lib/assets/images/inventory-items/bluray.png';
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

	let photo: string | null = $state(null);

	async function fetchStuff(): Promise<void> {
		const response = await fetch(`/api/friend-stuff/${stuffId}`);

		if (!response.ok) {
			Logger.error(`Stuff with id ${stuffId} not found!`);
		} else {
			stuff = (await response.json()) as Stuff;
		}

		loadingStuff = false;
	}

	async function fetchStuffImage(): Promise<void> {
		if (!stuff?.imageUrl) {
			return;
		}

		const response = await fetch(`/api/stuff/${stuffId}/photo/${stuff?.imageUrl}`);

		if (!response.ok) {
			Logger.error(`Error fetching stuff photo!`);
		} else {
			const blob = new Blob([await response.arrayBuffer()]);
			photo = URL.createObjectURL(blob);
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
		await fetchStuffImage();
		await fetchRental();
	});
</script>

<section>
	{#if loadingStuff || loadingMyRental}
		<p>Loading...</p>
	{:else if stuff}
		<h3>
			<span>{stuff?.userMeta ? `${stuff?.userMeta?.userName}'s` : ''} </span>
			<span>{stuff.name}</span>
		</h3>

		<img src={photo || bluray} alt={`Image of ${stuff?.name}`} />

		<p>{stuff.description}</p>

		<div class="rental-actions">
			{#if rental && !rental.status}
				<button popovertarget="confirm-cancellation">Cancel Reservation</button>
			{/if}

			<button onclick={handleRentClick} disabled={loadingMyRental || !!rental} class="rent"
				>Rent</button
			>
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
</section>

<style lang="scss">
	@use '../../../lib/styles/dialog/dialog.scss';
	@use '../../../lib/styles/layout/panel.scss';
	@use '../../../lib/styles/responsive.scss';

	section {
		@include panel.panel;
		display: flex;
		flex-direction: column;
		align-items: center;
		overflow: hidden;

		h3 {
			display: flex;
			flex-direction: column;
			align-items: center;
		}

		img {
			min-width: 90%;
			width: 90%;
			min-height: 10rem;
			height: 10rem;
			border-radius: 0.25rem;
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
			padding: 1rem 0;
			display: flex;
			flex-direction: column;
			gap: 0.5rem;
			width: 90%;

			button {
				width: 100%;
				height: 3rem;
				border: none;
				border-radius: 0.25rem;
			}

			button.rent {
				background-color: #cddc39;
			}
		}

		dialog {
			@include dialog.dialog;
		}
	}

	@media screen and (min-width: responsive.$tablet-width) {
		section {
			h3 {
				font-size: 2.5rem;
			}

			div.rental-actions {
				button {
					font-size: 1.25rem;
					margin-bottom: 1rem;
				}
			}

			img {
				min-height: 20rem;
				height: 20rem;
			}
		}
	}
</style>
