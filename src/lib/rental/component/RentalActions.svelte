<script lang="ts">
	import type { Stuff } from '$lib/stuff/model/stuff';
	import ApprovalForm from '../form/ApprovalForm.svelte';
	import CancelForm from '../form/CancelForm.svelte';
	import RejectForm from '../form/RejectForm.svelte';
	import RentForm from '../form/RentForm.svelte';
	import { RentalStatus, type MyRental } from '../model/rental';

	interface RentalActionsProps {
		userId: string | null;
		stuff: Stuff | null;
		rental: MyRental | null;
		renting: boolean;
		approving: boolean;
		rejecting: boolean;
		cancelling: boolean;
		handleRentClick: () => void;
		handleCancelReservation: (id?: number, callback?: () => void) => Promise<void>;
		handleRejectReservation: (id?: number, callback?: () => void) => Promise<void>;
		handleApproveReservation: (id?: number, callback?: () => void) => Promise<void>;
	}

	let {
		userId,
		stuff,
		rental,
		renting,
		approving,
		cancelling,
		rejecting,
		handleRentClick,
		handleApproveReservation,
		handleRejectReservation,
		handleCancelReservation
	}: RentalActionsProps = $props();

	let isRenter: boolean = $derived(stuff?.userIsOwner || false);

	function closePopover(id: string): void {
		const popover = document.getElementById(id) as HTMLDialogElement;
		if (popover) {
			popover.hidePopover();
		}
	}

	async function handleConfirmCancel(id: number, popoverId: string): Promise<void> {
		cancelling = true;

		await handleCancelReservation(id, () => {
			cancelling = false;
			closePopover(popoverId);
		});
	}

	async function handleConfirmReject(id: number, popoverId: string): Promise<void> {
		rejecting = true;

		await handleRejectReservation(id, () => {
			rejecting = false;
			closePopover(popoverId);
		});
	}

	async function handleConfirmApproval(id: number): Promise<void> {
		approving = true;
		await handleApproveReservation(id, () => {
			approving = false;
		});
	}
</script>

<div class="rental-actions">
	{#if isRenter}
		{#if rental?.status === RentalStatus.Reserved}
			<p>A friend is requesting to rent this item!</p>
			<ApprovalForm {rental} handleSubmit={handleConfirmApproval} {approving} />
			<RejectForm {rental} handleSubmit={handleConfirmReject} {rejecting} />
		{:else if rental?.status === RentalStatus.Approved}
			<p>You approved this item's rental reservation request!</p>
			<a href={`/friend-stuff/${stuff?.id}/exchange`} class="button-link">Ready to exchange?</a>
			<RejectForm {rental} handleSubmit={handleConfirmReject} {rejecting} />
		{:else if rental?.status === RentalStatus.Rented}
			<p>This item is currently being rented by: {rental?.renteeId}</p>
		{/if}
	{:else if userId === rental?.renteeId}
		{#if rental?.status === RentalStatus.Reserved}
			<p>You are currently requesting to rent this item.</p>
			<p>Waiting for approval from owner.</p>
		{:else if rental?.status === RentalStatus.Approved}
			<p>Your rental reservation has been approved by the owner!</p>
			<a href={`/friend-stuff/${stuff?.id}/exchange`} class="button-link">Ready to exchange?</a>
		{:else if rental?.status === RentalStatus.Rented}
			<p>You are currently renting this item.</p>
			<a href={`/friend-stuff/${stuff?.id}/exchange`} class="button-link">Ready to return?</a>
		{/if}

		{#if rental?.status === RentalStatus.Reserved || rental?.status === RentalStatus.Approved}
			<CancelForm {rental} handleSubmit={handleConfirmCancel} {cancelling} />
		{/if}
	{:else if rental?.status === RentalStatus.Reserved}
		<p>This item is currently reserved by another person.</p>
	{:else if rental?.status === RentalStatus.Rented}
		<p>This item is currently being rented by another person.</p>
	{:else if !stuff?.rentalId}
		<RentForm handleSubmit={handleRentClick} stuffId={stuff?.id || ''} {renting} />
	{/if}
</div>

<style lang="scss">
	@use '../../../lib/styles/responsive.scss';
	@use '../../../lib/styles/dialog/dialog.scss';
	@use '../../../lib/styles/forms/forms.scss';
	@use '../../../lib/styles/button/button.scss';

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

		a {
			@include button.button_link;
		}
	}

	@media screen and (min-width: responsive.$tablet-width) {
		div.rental-actions {
			a {
				font-size: 1.25rem;
				margin-bottom: 1rem;
			}
		}
	}
</style>
