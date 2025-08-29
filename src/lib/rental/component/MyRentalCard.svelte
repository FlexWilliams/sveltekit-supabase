<script lang="ts">
	import { goto } from '$app/navigation';
	import { RentalStatus, type MyRental } from '../model/rental';

	interface MyRentalCardProps {
		rental: MyRental;
		outgoing?: boolean;
		handleCancelReservation: (id?: number, callback?: () => void) => void;
		handleRejectReservation: (id?: number, callback?: () => void) => void;
		handleApproveReservation: (id?: number, callback?: () => void) => void;
	}

	let {
		rental,
		outgoing,
		handleCancelReservation,
		handleRejectReservation,
		handleApproveReservation
	}: MyRentalCardProps = $props();

	let cancelling: boolean = $state(false);
	let rejecting: boolean = $state(false);
	let approving: boolean = $state(false);

	function closePopover(id: string): void {
		const popover = document.getElementById(id) as HTMLDialogElement;
		if (popover) {
			popover.hidePopover();
		}
	}
</script>

<article>
	<h3>
		<span>{rental?.renterName}'s</span>
		<span>{rental?.itemName}</span>
	</h3>

	{#if outgoing}
		{#if rental?.status === RentalStatus.Reserved}
			<p>Status: <span>Awaiting Your Approval</span></p>
		{:else if rental?.status === RentalStatus.Cancelled}
			<p>Status: <span>Request was Cancelled</span></p>
		{:else if rental?.status === RentalStatus.Rejected}
			<p>Status: <span>You Rejected the Request</span></p>
		{:else if rental?.status === RentalStatus.Approved}
			<p>Status: <span>You Approved the request, awaiting item exchange</span></p>
		{/if}
	{:else if rental?.status === RentalStatus.Reserved}
		<p>Status: <span>Pending Approval</span></p>
	{:else if rental?.status === RentalStatus.Cancelled}
		<p>Status: <span>You Cancelled the Reservation</span></p>
	{:else if rental?.status === RentalStatus.Rejected}
		<p>Status: <span>Owner Rejected the Request</span></p>
	{:else if rental?.status === RentalStatus.Approved}
		<p>Status: <span>Owner Approved, arrange time for an Exchange!</span></p>
	{/if}

	{#if outgoing}
		{#if rental?.status === RentalStatus.Reserved}
			<button
				class="approve"
				onclick={() => {
					approving = true;

					handleApproveReservation(rental?.id, () => {
						approving = false;
					});
				}}
				disabled={approving}>Approve</button
			>
		{/if}
		{#if rental?.status === RentalStatus.Reserved || rental?.status === RentalStatus.Approved}
			<button class="cancel" popovertarget={`confirm-rejection-${rental?.id}`} disabled={rejecting}
				>Reject</button
			>
		{/if}
	{:else if rental.status === RentalStatus.Reserved || rental.status === RentalStatus.Approved}
		<button
			class="cancel"
			popovertarget={`confirm-cancellation-${rental?.id}`}
			disabled={cancelling}>Cancel Reservation</button
		>
	{/if}

	<button
		type="button"
		aria-label={`Navigate to ${rental?.itemName} detail page`}
		class="item-details"
		onclick={() => goto(`/friend-stuff/${rental?.itemId}`)}
	></button>
</article>

<dialog id={`confirm-cancellation-${rental?.id}`} popover="auto">
	<h3>
		<span>Are you sure you want to cancel your Reservation of:</span>
		<span>{rental?.itemName}?</span>
	</h3>
	<div class="actions">
		<button type="button" onclick={() => closePopover(`confirm-cancellation-${rental?.id}`)}
			>No</button
		>
		<button
			type="button"
			class="confirm"
			onclick={() => {
				closePopover(`confirm-cancellation-${rental?.id}`);
				cancelling = true;
				handleCancelReservation(rental?.id, () => {
					cancelling = false;
				});
			}}>Yes</button
		>
	</div>
</dialog>

<dialog id={`confirm-rejection-${rental?.id}`} popover="auto">
	<h3>
		<span>Are you sure you want to reject the Reservation of your:</span>
		<span>{rental?.itemName}?</span>
	</h3>
	<div class="actions">
		<button type="button" onclick={() => closePopover(`confirm-rejection-${rental?.id}`)}>No</button
		>
		<button
			type="button"
			class="confirm"
			onclick={() => {
				closePopover(`confirm-rejection-${rental?.id}`);
				rejecting = true;
				handleRejectReservation(rental?.id, () => {
					rejecting = false;
				});
			}}>Yes</button
		>
	</div>
</dialog>

<style lang="scss">
	@use '../../styles/dialog/dialog.scss';
	@use '../../styles/overlay/shadows.scss';

	article {
		position: relative;
		border: none;
		border-radius: 0.25rem;
		padding: 1rem;
		margin: 1rem 0;
		@include shadows.boxShadow;

		h3 {
			display: flex;
			flex-direction: column;
		}

		button.approve {
			position: relative;
			z-index: 2;
			height: 2rem;
			border: none;
			border-radius: 0.25rem;
			background-color: #cddc39;
			padding: 0 0.5rem;
		}

		button.cancel {
			position: relative;
			z-index: 2;
			height: 2rem;
			border: none;
			border-radius: 0.25rem;
			background-color: #cddc39;
			padding: 0 0.5rem;
		}

		button.item-details {
			position: absolute;
			top: 0;
			left: 0;
			border: none;
			background-color: transparent;
			height: 100%;
			width: 100%;
		}
	}

	dialog {
		@include dialog.dialog;
	}
</style>
