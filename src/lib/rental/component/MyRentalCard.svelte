<script lang="ts">
	import StuffPhoto from '$lib/photo/components/StuffPhoto.svelte';
	import ApprovalForm from '../form/ApprovalForm.svelte';
	import CancelForm from '../form/CancelForm.svelte';
	import RejectForm from '../form/RejectForm.svelte';
	import { RentalStatus, type MyRental } from '../model/rental';
	import MyRentalStatus from './MyRentalStatus.svelte';

	interface MyRentalCardProps {
		rental: MyRental;
		handleCancelReservation: (id?: number, callback?: () => void) => Promise<void>;
		handleRejectReservation: (id?: number, callback?: () => void) => Promise<void>;
		handleApproveReservation: (id?: number, callback?: () => void) => Promise<void>;
	}

	let {
		rental,
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

<article>
	<header>
		<h3>
			{#if rental?.isOwner}
				<span>Your</span>
			{:else}
				<span>{rental?.renterName}'s</span>
			{/if}
			<span>{rental?.itemName}</span>
		</h3>

		<section class="photo">
			<StuffPhoto
				cacheKey={`rental-${rental?.itemId}`}
				fetchUrl={`/api/stuff/${rental?.itemId}/photo/${rental.imageUrl}`}
				photoName={rental?.itemName}
			/>
		</section>
	</header>

	<MyRentalStatus {rental} />

	{#if rental?.isOwner}
		<div class="rental-action-buttons">
			{#if rental?.status === RentalStatus.Reserved}
				<ApprovalForm {rental} handleSubmit={handleConfirmApproval} {approving} />
			{/if}
			{#if rental?.status === RentalStatus.Reserved || rental?.status === RentalStatus.Approved}
				<RejectForm {rental} handleSubmit={handleConfirmReject} {rejecting} />
			{/if}
		</div>
	{:else if rental.status === RentalStatus.Reserved || rental.status === RentalStatus.Approved}
		<CancelForm {rental} handleSubmit={handleConfirmCancel} {cancelling} />
	{/if}

	<a
		href={`/friend-stuff/${rental?.itemId}`}
		aria-label={`Navigate to ${rental?.itemName} detail page`}
		class="item-details"
	></a>
</article>

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

		header {
			display: flex;
			align-items: center;
			justify-content: space-between;
			gap: 1rem;

			h3 {
				display: flex;
				flex-direction: column;
			}

			section.photo {
				width: 4rem;
				max-width: 4rem;
				height: 4rem;
				max-height: 4rem;
			}
		}

		div.rental-action-buttons {
			display: flex;
			flex-direction: column;
			gap: 1rem;
		}

		a.item-details {
			position: absolute;
			top: 0;
			left: 0;
			border: none;
			background-color: transparent;
			height: 100%;
			width: 100%;
		}
	}
</style>
