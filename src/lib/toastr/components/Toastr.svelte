<script lang="ts">
	import { take, tap, timer, type Subscription } from 'rxjs';
	import { onDestroy, onMount } from 'svelte';
	import { fade, fly } from 'svelte/transition';
	import { ToastrService, type ToastrConfig } from '../services/ToastrService';

	const defaultToastrDuration = 2000;

	const subscriptions: Subscription[] = [];

	let toastr: ToastrConfig | null = $state(null);

	let toast: boolean = $state(false);

	function listenForToastrMessages(): Subscription {
		return ToastrService.toastr$
			.pipe(
				tap((toastrConfig) => {
					toastr = toastrConfig;

					toast = true;

					timer(toastr?.duration || defaultToastrDuration)
						.pipe(
							take(1),
							tap(() => {
								toast = false;
							})
						)
						.subscribe();
				})
			)
			.subscribe();
	}

	onMount(() => {
		subscriptions.push(listenForToastrMessages());
	});

	onDestroy(() => {
		subscriptions.forEach((sub) => sub.unsubscribe());
	});
</script>

{#if toast && toastr}
	<dialog id="notification-toastr" in:fly={{ y: -200 }} out:fade>
		<p>{toastr?.message}</p>
	</dialog>
{/if}

<style lang="scss">
	@use '$lib/styles/overlay/z-index.scss';

	dialog {
		position: absolute;
		z-index: z-index.$toastr-z-index;
		display: flex;
		align-items: center;
		justify-content: center;
		top: 1.5rem;
		padding: 1rem;
		border: none;
		border-radius: 1rem;
		width: calc(100% - 4rem);
		min-height: 4rem;
		background-color: #81d4fa;
		max-width: calc(800px - 4rem);
		margin: auto;

		box-shadow:
			rgba(17, 17, 26, 0.1) 0px 8px 24px,
			rgba(17, 17, 26, 0.1) 0px 16px 56px,
			rgba(17, 17, 26, 0.1) 0px 24px 80px;

		p {
			text-align: center;
			font-weight: bold;
			margin: 0;
			padding: 0;
		}
	}
</style>
