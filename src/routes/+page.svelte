<script lang="ts">
	import advertisement from '$lib/assets/videos/advertisement.mp4';
</script>

<section>
	<video src={advertisement} muted autoplay loop>
		<!-- TODO: generate vtt files per ad -->
		<track default kind="captions" srclang="en" />
	</video>
</section>

<style lang="scss">
	@use '../lib/styles/layout/panel.scss';
	@use '../lib/styles/variables.scss';

	section {
		@include panel.panel;
		padding: 0;
		width: 100%;
		background-color: transparent;
	}

	video {
		width: 100%;
		margin: 1rem 0;
		@include variables.border-radius-panel;
	}
</style>
