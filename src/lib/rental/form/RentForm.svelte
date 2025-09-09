<script lang="ts">
	let { stuffId, handleSubmit } = $props();

	async function handleSubmitClick(event: Event): Promise<void> {
		event.preventDefault();
		handleSubmit();
	}
</script>

<form name="rent" method="POST" action="?/rent">
	<input type="hidden" name="stuff-id" value={stuffId} />
	<button type="submit" onclick={handleSubmitClick}>Rent</button>
</form>

<style lang="scss">
	@use '../../styles/forms/forms.scss';

	button {
		@include forms.rental_form_primary_action_button;
	}
</style>
