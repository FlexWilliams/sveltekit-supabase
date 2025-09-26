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
	@use '../../styles/dialog/dialog.scss';
	@use '../../styles/forms/forms.scss';
	@use '../../styles/responsive.scss';

	button.cancel {
		@include forms.rental_form_primary_action_button;
	}

	dialog {
		@include dialog.dialog;
	}

	@media screen and (min-width: responsive.$tablet-width) {
		button.cancel {
			@include forms.rental_form_action_button_tablet;
		}
	}
</style>
