<script lang="ts">
	let { rental, handleSubmit, rejecting } = $props();

	async function handleSubmitClick(event: Event, id: number, popoverId: string): Promise<void> {
		event.preventDefault();
		handleSubmit(id, popoverId);
	}
</script>

<button type="button" popovertarget={`confirm-rejection-${rental?.id}`} class="reject"
	>Reject Reservation</button
>

<dialog id={`confirm-rejection-${rental?.id}`} popover="auto">
	<h3>
		<span>Are you sure you want to reject the Reservation of your:</span>
		<span>{rental?.itemName}?</span>
	</h3>
	<form name="reject" method="POST" action="?/reject">
		<input type="hidden" name="rental-id" value={rental?.id} />
		<button type="button" popovertarget={`confirm-rejection-${rental?.id}`}
			>No, Keep Reservation</button
		>
		<button
			type="submit"
			onclick={(e) => handleSubmitClick(e, rental?.id, `confirm-rejection-${rental?.id}`)}
			disabled={rejecting}>Yes, Reject</button
		>
	</form>
</dialog>

<style lang="scss">
	@use '../../styles/dialog/dialog.scss';
	@use '../../styles/forms/forms.scss';
	@use '../../styles/responsive.scss';

	button.reject {
		@include forms.rental_form_secondary_action_button;
	}

	dialog {
		@include dialog.dialog;
	}

	@media screen and (min-width: responsive.$tablet-width) {
		button.reject {
			@include forms.rental_form_action_button_tablet;
		}
	}
</style>
