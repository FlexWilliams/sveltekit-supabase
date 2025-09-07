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
	button {
		width: 100%;
		height: 3rem;
		border: none;
		border-radius: 0.25rem;
		background-color: #cddc39;
	}
</style>
