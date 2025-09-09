<script>
	let { children } = $props();
</script>

<section>
	{@render children()}
</section>

<style lang="scss">
	@use '../../lib/styles/layout/panel.scss';
	@use '../../lib/styles/responsive.scss';

	section {
		@include panel.panel;
		display: flex;
		flex-direction: column;
		position: relative;
	}
</style>
