<script lang="ts">
	import type { Stuff } from '$lib/stuff/components/model/stuff.js';

	let { data } = $props();

	let stuff = $derived.by(() => (data.stuff.length > 0 ? data.stuff[0] : ({} as Stuff)));
</script>

<section>
	<h2>{stuff?.name}</h2>

	<button
		type="button"
		aria-label="Back to My Stuff page"
		class="close"
		onclick={() => window.history.back()}>X</button
	>
</section>

<style lang="scss">
	@use '../../../lib/styles/overlay/shadows.scss';

	section {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;

		h2 {
			text-align: center;
		}

		button.close {
			position: absolute;
			top: 0.5rem;
			right: 0.5rem;
			display: flex;
			justify-content: center;
			align-items: center;
			width: 3rem;
			height: 3rem;
			border-radius: 3rem;
			border: none;
			background-color: #ffeb3b;
			font-weight: bold;
			@include shadows.boxShadow;
		}
	}
</style>
