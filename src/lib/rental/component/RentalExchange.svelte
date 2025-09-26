<script lang="ts">
	import { PUBLIC_EXCHANGE_URL } from '$env/static/public';
	import { Logger } from '$lib/logging/logger';
	import { userState } from '$lib/state/user-state.svelte';

	import * as qrcodegen from '$lib/vendor/qrcodegen.js';
	import { onMount, untrack } from 'svelte';

	let { stuff, rental, loading, pickupKey, returnKey, handleGenerateQr, handleScanQr } = $props();

	let userId: string | null = $derived(userState.id);

	let isRenter = $derived(userId === stuff?.userId);

	$effect(() => {
		if (pickupKey) {
			untrack(() => {
				drawQrCode(pickupKey);
			});
		}

		if (returnKey) {
			untrack(() => {
				drawQrCode(returnKey);
			});
		}
	});

	function drawQrCode(key: string): void {
		const qr = qrcodegen.default.QrCode as any;

		const canvasElement = document.getElementById('qr-code-canvas') as HTMLCanvasElement;
		const url = `${PUBLIC_EXCHANGE_URL}/friend-stuff/${rental?.itemId}/exchange?${isRenter ? 'pickupKey' : 'returnKey'}=${key}`;

		Logger.debug(`QR Code url: ${url}`);

		if (canvasElement) {
			const qrCode = qr.encodeText(url, { ordinal: 1, formatBits: 0 });
			var ctx = canvasElement.getContext('2d') as CanvasRenderingContext2D;
			var border = 2;
			var scale = 4;
			var darkColor = 'black';
			var lightColor = 'azure'; // To match bg color

			for (let y = -border; y < qrCode.size + border; y++) {
				for (let x = -border; x < qrCode.size + border; x++) {
					ctx.fillStyle = qrCode.getModule(x, y) ? darkColor : lightColor;
					ctx.fillRect((x + border + 16) * scale, ((y + border + 16) * scale) / 2, scale, scale);
				}
			}
		}
	}

	onMount(async () => {
		await handleGenerateQr();
	});
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
		<div class="canvas-container">
			<canvas id="qr-code-canvas"></canvas>
			{#if loading}
				<div class="overlay"><p>Loading...</p></div>
			{/if}
		</div>

		<div class="help">
			{#if pickupKey && isRenter}
				<p>Please have your rentee scan this QR code to complete the exchange!</p>
			{:else if returnKey && !isRenter}
				<p>Please have the owner scan this QR code to complete the exchange!</p>
			{/if}
		</div>

		<div class="exchange-actions">
			{#if isRenter}
				<button type="button" onclick={handleGenerateQr} disabled={loading}>Generate QR Code</button
				>
			{:else}
				<button type="button" onclick={handleScanQr} disabled={loading}>Scan QR Code</button>
			{/if}
		</div>
	</section>
</section>

<style lang="scss">
	@use '../../../lib/styles/layout/panel.scss';
	@use '../../../lib/styles/overlay/overlay.scss';

	section {
		@include overlay.overlay_section;
		z-index: 4;

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
		align-items: center;
		justify-content: center;
		overflow-y: auto;
		
		div.canvas-container {
			width: calc(16rem + 2rem);
			height: calc(16rem + 2rem);
			position: relative;

			canvas {
				width: 16rem;
				height: 16rem;
				border: 1px solid rebeccapurple;
				padding: 1rem;
				border-radius: 0.25rem;
			}

			div.overlay {
				border-radius: 0.25rem;
				position: absolute;
				top: 0;
				left: 0;
				display: flex;
				align-items: center;
				justify-content: center;
				width: 100%;
				height: 100%;
				background-color: rgba(255, 255, 255, 0.76);

				p {
					text-align: center;
				}
			}
		}

		div.help {
			min-height: 4rem;

			p {
				text-align: center;
			}
		}

		div.exchange-actions {
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
