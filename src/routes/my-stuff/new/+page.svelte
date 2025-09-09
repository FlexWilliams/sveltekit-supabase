<script lang="ts">
	import StuffForm from '$lib/stuff/components/StuffForm.svelte';

	let { form } = $props();
</script>

<section>
	<h2>Add Stuff</h2>

	<StuffForm photos={[]} {form} />

	<a href="/my-stuff" aria-label="Back to My Stuff page" class="close">X</a>
</section>

<style lang="scss">
	@use '../../../lib/styles/forms/forms.scss';
	@use '../../../lib/styles/layout/panel.scss';
	@use '../../../lib/styles/responsive.scss';

	section {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;

		h2 {
			@include forms.form_header;
		}

		a.close {
			@include panel.panel_close_button_link;
		}
	}

	@media screen and (min-width: responsive.$tablet-width) {
		section {
			h2 {
				font-size: 2.5rem;
				margin-top: 2rem;
			}

			a.close {
				width: 5rem;
				height: 5rem;
				font-size: 1.5rem;
			}
		}
	}
</style>
