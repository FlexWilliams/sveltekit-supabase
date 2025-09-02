<script lang="ts">
	import { userState } from '$lib/state/user-state.svelte';

	let { stuff, rental } = $props();

	let userId: string | null = $derived(userState.id);

	let isRenter = $derived(userId === stuff?.userId);
</script>

<section>
	<header>
		<div>
			<a href="./" class="close" aria-label="Close">X</a>
		</div>
		<div>
			<h2>
				<span>Ready to exchange</span>
				<span>{stuff?.name}?</span>
			</h2>
		</div>
	</header>

	<section class="exchanger">
		<canvas id="qr-code-canvas"> </canvas>
		<div>
			{#if isRenter}
				<button>Generate QR Code</button>
			{:else}
				<button>Scan QR Code</button>
			{/if}
		</div>
	</section>
</section>

<style lang="scss">
	@use '../../../lib/styles/layout/panel.scss';
	@use '../../../lib/styles/overlay/overlay.scss';

	section {
		@include overlay.overlay_section;

		header {
			div {
				&:last-of-type {
					justify-content: center;
				}
			}

			h2 {
				text-align: center;
			}
		}
	}

	section.exchanger {
		@include panel.panel;
		position: relative;
		max-height: calc(80% - 3rem);
		margin: 0 2rem;
		width: calc(100% - 5rem);
		max-width: calc(100% - 5rem);

		canvas {
			width: calc(100% - 2px);
			height: 80%;
			border: 1px solid rebeccapurple;
			border-radius: 0.25rem;
		}

		div {
			height: calc(20% - 2rem);
			max-height: calc(20% - 2rem);
			margin-top: 2rem;
			display: flex;
			justify-content: center;
			align-items: center;

			button {
				height: 3rem;
				min-height: 3rem;
				border: none;
				border-radius: 0.25rem;
				padding: 0 2rem;
				background-color: #cddc39;
			}
		}
	}
</style>
