<script lang="ts">
	import { goto } from '$app/navigation';
	import type { MyRental } from '../model/rental';

	interface MyRentalCardProps {
		rental: MyRental;
		handleCancelReservation: (id?: number) => void;
	}

	let { rental, handleCancelReservation }: MyRentalCardProps = $props();

	function closePopover(): void {
		const popover = document.getElementById('confirm-cancellation') as HTMLDialogElement;
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
	<p>Status: <span>Pending Approval</span></p>

	<button class="cancel" popovertarget="confirm-cancellation">Cancel Reservation</button>

	<button
		type="button"
		aria-label={`Navigate to ${rental?.itemName} detail page`}
		class="item-details"
		onclick={() => goto(`/friend-stuff/${rental?.itemId}`)}
	></button>
</article>

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
