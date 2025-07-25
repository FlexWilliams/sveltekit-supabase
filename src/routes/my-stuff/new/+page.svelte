<script lang="ts">
	import { Logger } from '$lib/logging/logger';
	import type { Stuff } from '$lib/stuff/components/model/stuff';
	import { ToastrService } from '$lib/toastr/services/ToastrService';

	async function handleAddSomethingResponse(this: XMLHttpRequest): Promise<void> {
		if (this.status === 201 && this.response) {
			const newItem = JSON.parse(this.response) as Stuff;
			Logger.debug(`${JSON.stringify(newItem)}`);

			ToastrService.alert(`New Item Saved!`);
		} else {
			Logger.error(JSON.parse(this.response)?.message);
		}
	}

	async function handleAddSomethingRandom(): Promise<void> {
		const formData = new FormData();
		formData.append('name', 'new item');
		formData.append('photo', '');
		formData.append('trust_rating', '4');
		formData.append('description', 'New item description');
		formData.append('available', 'true');

		// TODO: Convert to fetch PUT /api/profile
		// See https://github.com/vercel/next.js/issues/73220
		const req = new XMLHttpRequest();
		req.addEventListener('load', handleAddSomethingResponse);
		req.open('POST', '/api/my-stuff');
		req.send(formData);
	}
</script>

<section>
	<h2>Add Stuff</h2>

	<button onclick={handleAddSomethingRandom}>Add something random</button>

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
