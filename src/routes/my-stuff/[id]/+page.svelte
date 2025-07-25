<script lang="ts">
	import { goto } from '$app/navigation';
	import { Logger } from '$lib/logging/logger.js';
	import type { Stuff } from '$lib/stuff/components/model/stuff.js';
	import { ToastrService } from '$lib/toastr/services/ToastrService.js';

	let { data } = $props();

	let stuff = $derived.by(() => (data.stuff.length > 0 ? data.stuff[0] : ({} as Stuff)));

	function closePopover(): void {
		document.getElementById(`remove-stuff-confirmation`)?.hidePopover();
	}

	function handleRemoveStuffNo(): void {
		closePopover();
	}

	async function handleRemoveStuffYes(): Promise<void> {
		const params = window.location.pathname.split('/');
		const stuffId = params[params.length - 1];

		const removed = await fetch(`/api/my-stuff/${stuffId}`, {
			method: 'DELETE'
		});

		if (removed.ok && removed.status === 204) {
			closePopover();

			ToastrService.alert(`Item removed`);

			goto('/my-stuff');
		} else {
			Logger.error(`Error removing the item with id: ${stuffId}`);
		}
	}
</script>

<section>
	<h2>{stuff?.name}</h2>

	<dialog id="remove-stuff-confirmation" popover="auto">
		<h3>Are you sure you want to delete this item?</h3>
		<button onclick={handleRemoveStuffNo}>Cancel</button>
		<button onclick={handleRemoveStuffYes}>Yes</button>
	</dialog>

	<button popovertarget="remove-stuff-confirmation" aria-label={`Remove Item`}>Remove</button>

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
