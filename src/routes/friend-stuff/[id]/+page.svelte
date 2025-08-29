<script lang="ts">
	import { goto } from '$app/navigation';
	import bluray from '$lib/assets/images/inventory-items/bluray.png';
	import { Logger } from '$lib/logging/logger';
	import { RentalStatus, type MyRental } from '$lib/rental/model/rental';
	import type { Stuff } from '$lib/stuff/model/stuff';
	import { ToastrService } from '$lib/toastr/services/ToastrService';
	import { onMount } from 'svelte';

	let loadingStuff = $state(true);

	let loadingMyRental = $state(true);

	let stuffId: string | null = $state(null);

	let stuff: Stuff | null = $state(null);

	let rental: MyRental | null = $state(null);

	let photo: string | null = $state(null);

	let renting: boolean = $state(false);

	let cancelling: boolean = $state(false);

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
			photo = await response.text();
		}

		loadingStuff = false;
	}

	async function fetchRental(): Promise<void> {
		loadingMyRental = true;

		const response = await fetch(`/api/my-rentals?stuffId=${stuffId}`);

		if (response.ok) {
			const rentals = (await response.json()) as MyRental[];
			if (rentals?.length > 0) {
				rental = rentals[0];
			}
		}

		loadingMyRental = false;
	}

	async function handleRentClick(): Promise<void> {
		renting = true;

		const rentalResponse = await fetch('/api/my-rentals', {
			method: 'POST',
			body: JSON.stringify({ stuffId: stuff?.id }),
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

		renting = false;
	}

	function closePopover(): void {
		const popover = document.getElementById('confirm-cancellation') as HTMLDialogElement;
		if (popover) {
			popover.hidePopover();
		}
	}

	async function handleCancelReservation(id?: number): Promise<void> {
		cancelling = true;

		const response = await fetch(`/api/my-rentals/${rental?.id}/cancel`, {
			method: 'POST'
		});

		if (response.ok) {
			rental = null;
			ToastrService.alert(`Your reservation was\nCancelled!`);
		} else {
			ToastrService.error(`There was an error cancelling your reservation.`);
			Logger.error(`There was an error cancelling My Rental w/id ${id}`);
		}

		cancelling = false;
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
			{#if rental?.status === RentalStatus.Reserved || rental?.status === RentalStatus.Approved}
				<button popovertarget="confirm-cancellation" disabled={cancelling}
					>Cancel Reservation</button
				>
			{/if}

			<button onclick={handleRentClick} disabled={renting || rental !== null} class="rent"
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
