<script lang="ts">
	import { goto } from '$app/navigation';
	import { Logger } from '$lib/logging/logger.js';
	import StuffForm from '$lib/stuff/components/StuffForm.svelte';
	import type { Stuff } from '$lib/stuff/model/stuff.js';
	import { ToastrService } from '$lib/toastr/services/ToastrService.js';

	let { data } = $props();

	let stuff = $derived.by(() => (data.stuff.length > 0 ? data.stuff[0] : ({} as Stuff)));

	function showPopover(): void {
		document.getElementById(`remove-stuff-confirmation`)?.showPopover();
	}

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

	<StuffForm {stuff} handleRemove={showPopover} />

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
	@use '../../../lib/styles/forms/forms.scss';
	@use '../../../lib/styles/layout/panel.scss';

	section {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;

		h2 {
			@include forms.form_header;
		}

		button.close {
			@include panel.panel_close_button;
		}
	}
</style>
