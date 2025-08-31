<script lang="ts">
	import { goto } from '$app/navigation';
	import { Logger } from '$lib/logging/logger';
	import StuffPhoto from '$lib/photo/components/StuffPhoto.svelte';
	import { RentalStatus, type MyRental } from '$lib/rental/model/rental';
	import { userState } from '$lib/state/user-state.svelte';
	import type { Stuff } from '$lib/stuff/model/stuff';
	import { ToastrService } from '$lib/toastr/services/ToastrService';
	import { onMount } from 'svelte';

	let loadingStuff = $state(true);

	let loadingMyRental = $state(true);

	let stuffId: string | null = $state(null);

	let stuff: Stuff | null = $state(null);

	let rental: MyRental | null = $state(null);

	let renting: boolean = $state(false);

	let cancelling: boolean = $state(false);

	let rejecting: boolean = $state(false);

	let userId: string | null = $derived(userState.id);

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
		if (!stuff?.rentalId) {
			loadingMyRental = false;
			return;
		}

		loadingMyRental = true;

		const response = await fetch(`/api/rentals/${stuff?.rentalId}`);

		if (response.ok) {
			rental = (await response.json()) as MyRental;
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

	function closePopover(id: string): void {
		const popover = document.getElementById(id) as HTMLDialogElement;
		if (popover) {
			popover.hidePopover();
		}
	}

	async function handleCancelReservation(id?: number): Promise<void> {
		cancelling = true;

		const response = await fetch(`/api/my-rentals/${id}/cancel`, {
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

	async function handleRejectRentalRequest(id?: number): Promise<void> {
		rejecting = true;

		const response = await fetch(`/api/my-rentals/${id}/reject`, {
			method: 'POST'
		});

		if (response.ok) {
			rental = null;
			ToastrService.alert(`The rental request was\nRejected!`);
		} else {
			ToastrService.error(`There was an error rejecting the rental request.`);
		}

		rejecting = false;
	}

	onMount(async () => {
		let tokens = window.location.pathname.split('/');
		stuffId = tokens[tokens.length - 1];
		await fetchStuff();
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

		<section class="photo">
			<StuffPhoto
				cacheKey={stuff.id}
				fetchUrl={`/api/stuff/${stuffId}/photo/${stuff?.imageUrl}`}
				photoName={stuff?.name}
			/>
		</section>
		<p>{stuff.description}</p>

		<div class="rental-actions">
			{#if stuff?.userId !== userId}
				{#if rental?.status === RentalStatus.Reserved || rental?.status === RentalStatus.Approved}
					<button popovertarget="confirm-cancellation" disabled={cancelling}
						>Cancel Reservation</button
					>
				{/if}

				<button onclick={handleRentClick} disabled={renting || rental !== null} class="rent"
					>Rent</button
				>
			{:else if rental?.status === RentalStatus.Reserved}
				<p>This item is currently being requested to rent!</p>
			{/if}
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
				<button type="button" onclick={() => closePopover('confirm-cancellation')}>No</button>
				<button
					type="button"
					class="confirm"
					onclick={() => {
						closePopover('confirm-cancellation');
						handleCancelReservation(rental?.id);
					}}>Yes</button
				>
			</div>
		</dialog>
	{/if}

	{#if rental?.status === RentalStatus.Approved}
		<p>The item is ready to be exchanged!</p>

		{#if stuff?.userId === userId}
			<button type="button" popovertarget="confirm-rejection" disabled={rejecting} class="reject"
				>Reject</button
			>
		{/if}
	{/if}

	<dialog id="confirm-rejection" popover="auto">
		<h3>
			<span>Are you sure you want to reject the rental request for:</span>
			<span>{rental?.itemName}?</span>
		</h3>
		<div class="actions">
			<button type="button" onclick={() => closePopover('confirm-rejection')}>No</button>
			<button
				type="button"
				class="confirm"
				onclick={() => {
					closePopover('confirm-rejection');
					handleRejectRentalRequest(rental?.id);
				}}>Yes</button
			>
		</div>
	</dialog>

	{#if stuff?.userId !== userId || (stuff?.userId === userId && (rental?.status === RentalStatus.Reserved || rental?.status === RentalStatus.Approved || rental?.status === RentalStatus.Rented))}
		<button type="button" class="chat">Chat</button>
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
		position: relative;

		h3 {
			display: flex;
			flex-direction: column;
			align-items: center;
		}

		section.photo {
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

		button.chat {
			position: absolute;
			right: 1rem;
			bottom: 1rem;
			height: 3rem;
			width: 3rem;
			border-radius: 3rem;
			border: none;
			background-color: #cddc39;
			text-align: center;
		}

		button.reject {
			width: 90%;
			height: 3rem;
			border: none;
			border-radius: 0.25rem;
			background-color: #cddc39;
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

			section.photo {
				min-height: 20rem;
				height: 20rem;
			}
		}
	}
</style>
