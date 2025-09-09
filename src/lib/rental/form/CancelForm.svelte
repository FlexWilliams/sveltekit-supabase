<script lang="ts">
	let { rental, handleSubmit, cancelling } = $props();

	async function handleSubmitClick(event: Event, id: number, popoverId: string): Promise<void> {
		event.preventDefault();
		handleSubmit(id, popoverId);
	}
</script>

<button type="button" popovertarget={`confirm-cancellation-${rental?.id}`} class="cancel"
	>Cancel Reservation</button
>

<dialog id={`confirm-cancellation-${rental?.id}`} popover="auto">
	<h3>
		<span>Are you sure you want to cancel your Reservation of:</span>
		<span>{rental?.itemName}?</span>
	</h3>
	<form name="cancel" method="POST" action="?/cancel">
		<input type="hidden" name="rental-id" value={rental?.id} />
		<button type="button" popovertarget={`confirm-cancellation-${rental?.id}`}
			>No, Keep Reservation</button
		>
		<button
			type="submit"
			onclick={(e) => handleSubmitClick(e, rental?.id, `confirm-cancellation-${rental?.id}`)}
			disabled={cancelling}>Yes, Cancel</button
		>
	</form>
</dialog>

<style lang="scss">
	@use '../../../lib/styles/dialog/dialog.scss';

	button.cancel {
		width: 100%;
		height: 3rem;
		border: none;
		border-radius: 0.25rem;
		background-color: #cddc39;
		position: relative;
		z-index: 2;
	}

	dialog {
		@include dialog.dialog;
	}
</style>
