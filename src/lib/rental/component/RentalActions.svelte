<script lang="ts">
	import { userState } from '$lib/state/user-state.svelte';
	import type { Stuff } from '$lib/stuff/model/stuff';
	import { RentalStatus, type MyRental } from '../model/rental';

	interface RentalActionsProps {
		stuff: Stuff | null;
		rental: MyRental | null;
		renting: boolean;
		approving: boolean;
		rejecting: boolean;
		cancelling: boolean;
		handleRentClick: () => void;
		handleCancelReservation: () => void;
		handleApproveRentalRequest: () => void;
		handleRejectRentalRequest: () => void;
	}

	let {
		stuff,
		rental,
		renting,
		approving,
		cancelling,
		rejecting,
		handleRentClick,
		handleApproveRentalRequest,
		handleRejectRentalRequest,
		handleCancelReservation
	}: RentalActionsProps = $props();

	let userId: string | null = $derived(userState.id);

	let isRenter: boolean = $derived(userId === stuff?.userId);

	function closePopover(id: string): void {
		const popover = document.getElementById(id) as HTMLDialogElement;
		if (popover) {
			popover.hidePopover();
		}
	}
</script>

<div class="rental-actions">
	<!-- TODO: make into component -->
	{#if isRenter}
		{#if rental?.status === RentalStatus.Reserved}
			<p>A friend is requesting to rent this item!</p>
			<button onclick={handleApproveRentalRequest} disabled={approving} class="primary"
				>Approve</button
			>
		{:else if rental?.status === RentalStatus.Approved}
			<p>You approved this item's rental reservation request!</p>
			<p>Arrange for a time to exchange with: {rental?.renteeId}</p>
			<button>Ready to exchange?</button>
			<button type="button" popovertarget="confirm-rejection" disabled={rejecting} class="primary"
				>Reject</button
			>
		{:else if rental?.status === RentalStatus.Rented}
			<p>This item is currently being rented by: {rental?.renteeId}</p>
		{/if}
	{:else if userId === rental?.renteeId}
		{#if rental?.status === RentalStatus.Reserved}
			<p>You are currently requesting to rent this item.</p>
			<p>Waiting for approval from owner.</p>
		{:else if rental?.status === RentalStatus.Approved}
			<p>You rental reservation has been approved by the owner!</p>
			<p>Arrange for a time to exchange with: {rental?.renteeId}</p>
			<button>Ready to exchange?</button>
		{:else if rental?.status === RentalStatus.Rented}
			<p>You are currently renting this item.</p>
			<button>Ready to return?</button>
		{/if}

		{#if rental?.status === RentalStatus.Reserved || rental?.status === RentalStatus.Approved}
			<button popovertarget="confirm-cancellation" disabled={cancelling} class="primary"
				>Cancel Reservation</button
			>
		{/if}
	{:else if rental?.status === RentalStatus.Reserved}
		<p>This item is currently reserved by another person.</p>
	{:else if rental?.status === RentalStatus.Rented}
		<p>This item is currently being rented by another person.</p>
	{:else if !rental?.renteeId}
		<button onclick={handleRentClick} disabled={renting || rental !== null} class="primary"
			>Rent</button
		>
	{/if}
</div>

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
					handleCancelReservation();
				}}>Yes</button
			>
		</div>
	</dialog>
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
				handleRejectRentalRequest();
			}}>Yes</button
		>
	</div>
</dialog>

<style lang="scss">
	@use '../../../lib/styles/responsive.scss';
	@use '../../../lib/styles/dialog/dialog.scss';

	div.rental-actions {
		height: calc(25% - 2rem);
		max-height: calc(25% - 2rem);
		overflow-y: auto;
		padding: 1rem 0;
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		width: 90%;

		p {
			text-align: center;
			margin: 0;
		}

		button {
			width: 100%;
			height: 3rem;
			min-height: 3rem;
			border: none;
			border-radius: 0.25rem;
		}
	}

	button.primary {
		width: 90%;
		height: 3rem;
		border: none;
		border-radius: 0.25rem;
		background-color: #cddc39;
	}

	dialog {
		@include dialog.dialog;
	}

	@media screen and (min-width: responsive.$tablet-width) {
		div.rental-actions {
			button {
				font-size: 1.25rem;
				margin-bottom: 1rem;
			}
		}
	}
</style>
