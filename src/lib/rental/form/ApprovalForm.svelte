<script lang="ts">
	let { rental, handleSubmit, approving } = $props();

	async function handleSubmitClick(event: Event): Promise<void> {
		event.preventDefault();
		handleSubmit(rental?.id);
	}
</script>

<form name="approve" method="POST" action="?/approve">
	<input type="hidden" name="rental-id" value={rental?.id} />
	<button type="submit" onclick={handleSubmitClick} disabled={approving}>Approve</button>
</form>

<style lang="scss">
	@use '../../styles/forms/forms.scss';

	button {
		@include forms.rental_form_primary_action_button;
	}
</style>
