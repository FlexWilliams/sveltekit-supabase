<script>
	let { children } = $props();
</script>

<section class="panel">
	{@render children()}
</section>

<style lang="scss">
	@use '../../lib/styles/layout/panel.scss';

	section {
		@include panel.panel;
	}
</style>
