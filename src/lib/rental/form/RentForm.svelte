<script lang="ts">
	let { stuffId, handleSubmit, renting } = $props();

	async function handleSubmitClick(event: Event): Promise<void> {
		event.preventDefault();
		handleSubmit();
	}
</script>

<form name="rent" method="POST" action="?/rent">
	<input type="hidden" name="stuff-id" value={stuffId} />
	<button type="submit" onclick={handleSubmitClick} disabled={renting}>Rent</button>
</form>

<style lang="scss">
	@use '../../styles/forms/forms.scss';

	button {
		@include forms.rental_form_primary_action_button;
	}
</style>
