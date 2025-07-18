<script>
	let { children } = $props();
</script>

<section>
	{@render children()}
</section>

<style lang="scss">
	@use '../../lib/styles/layout/panel.scss';

	section {
		@include panel.panel;
	}
</style>
