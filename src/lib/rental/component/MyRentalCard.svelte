<script lang="ts">
	import { goto } from '$app/navigation';
	import { RentalStatus, type MyRental } from '../model/rental';

	interface MyRentalCardProps {
		rental: MyRental;
		outgoing?: boolean;
		handleCancelReservation: (id?: number) => void;
		handleRejectReservation: (id?: number) => void;
	}

	let { rental, outgoing, handleCancelReservation, handleRejectReservation }: MyRentalCardProps =
		$props();

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
		<p>Status: <span>Awaiting Your Approval</span></p>
	{:else}
		<p>Status: <span>Pending Approval</span></p>
	{/if}

	{#if outgoing}
		<button class="cancel" popovertarget={`confirm-rejection-${rental?.id}`}>Reject</button>
	{:else if rental.status === RentalStatus.Reserved || rental.status === RentalStatus.Approved}
		<button class="cancel" popovertarget={`confirm-cancellation-${rental?.id}`}
			>Cancel Reservation</button
		>
	{:else}
		<button class="cancel" disabled>{rental?.status}</button>
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
				handleCancelReservation(rental?.id);
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
				handleRejectReservation(rental?.id);
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
