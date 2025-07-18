<script>
	let { children } = $props();
</script>

<section>
	{@render children()}

	<button type="button" aria-label="Add item to your Stuff" class="add-item">+</button>
</section>

<style lang="scss">
	@use '../../lib/styles/layout/panel.scss';
	@use '../../lib/styles/overlay/shadows.scss';

	section {
		@include panel.panel;
		display: flex;
		flex-direction: column;
		position: relative;

		button.add-item {
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
