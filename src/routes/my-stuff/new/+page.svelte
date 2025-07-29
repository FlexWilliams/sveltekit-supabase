<script lang="ts">
	import StuffForm from '$lib/stuff/components/StuffForm.svelte';
</script>

<section>
	<h2>Add Stuff</h2>

	<StuffForm />

	<button
		type="button"
		aria-label="Back to My Stuff page"
		class="close"
		onclick={() => window.history.back()}>X</button
	>
</section>

<style lang="scss">
	@use '../../../lib/styles/forms/forms.scss';
	@use '../../../lib/styles/layout/panel.scss';

	section {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;

		h2 {
			@include forms.form_header;
		}

		button.close {
			@include panel.panel_close_button;
		}
	}
</style>
