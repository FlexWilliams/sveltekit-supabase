<script lang="ts">
	import { goto } from '$app/navigation';
	import { Logger } from '$lib/logging/logger';
	import NewStuffPhotoCarousel from '$lib/stuff/components/NewStuffPhotoCarousel.svelte';
	import type { Stuff } from '$lib/stuff/model/stuff';
	import { ToastrService } from '$lib/toastr/services/ToastrService';

	let saving = $state(false);

	let photos: File[] = $state([]);

	let name: string | null = $state(null);

	let trustLevel: number = $state(5);

	let description: string | null = $state(null);

	async function handleAddSomethingResponse(this: XMLHttpRequest): Promise<void> {
		if (this.status === 201 && this.response) {
			const newItem = JSON.parse(this.response) as Stuff;
			Logger.debug(`${JSON.stringify(newItem)}`);

			ToastrService.alert(`New Item Saved!`);

			saving = false;

			goto(`/my-stuff/${newItem.id}`);
		} else {
			Logger.error(JSON.parse(this.response)?.message);
		}
	}

	function getFormData(
		name: string,
		photos: File[],
		trustLevel: number,
		description: string | null
	): FormData {
		const formData = new FormData();

		formData.append('name', name);

		photos.forEach((p, idx) => formData.append(`photo_${idx}`, p));

		formData.append('available', 'true');

		formData.append('trust_level', `${trustLevel}`);

		if (description) {
			formData.append('description', description);
		}

		return formData;
	}

	function handlePhotosChange(event: Event): void {
		const files: FileList = (event.target as any)?.files;

		if (!files || files.length === 0) {
			return;
		}

		photos = []; // TODO: push/selectively remove instead of recreate each time!

		for (let i = 0; i < files.length; i++) {
			const photo = files.item(i);

			if (photo) {
				photos.push(photo);
			}
		}
	}

	async function handleFormSubmission(event: Event): Promise<void> {
		event.preventDefault();

		saving = true;

		if (!name || !photos || !trustLevel) {
			return;
		}

		const formData = getFormData(name, $state.snapshot(photos), trustLevel, description);

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

	<form name="add-new-stuff">
		<div class="form-field">
			<label>
				<span>Name*:</span>
				<input type="text" name="name" bind:value={name} />
			</label>
		</div>

		<NewStuffPhotoCarousel {photos} />

		<div class="form-field">
			<label>
				<span>Photo(s)*:</span>
				<input
					type="file"
					name="photos"
					accept="image/*"
					multiple={true}
					onchange={handlePhotosChange}
				/>
			</label>
		</div>

		<div class="form-field">
			<label>
				<span>Trust Level*:</span>
				<input type="number" name="trust_level" min="1" max="10" bind:value={trustLevel} />
			</label>
		</div>

		<div class="form-field">
			<label>
				<span>Description (Optional):</span>
				<input type="text" name="description" bind:value={description} />
			</label>
		</div>

		<button
			type="submit"
			onclick={handleFormSubmission}
			disabled={!name || !photos || !trustLevel || saving}>Save</button
		>
	</form>

	<button
		type="button"
		aria-label="Back to My Stuff page"
		class="close"
		onclick={() => window.history.back()}>X</button
	>
</section>

<style lang="scss">
	@use '../../../lib/styles/overlay/shadows.scss';
	@use '../../../lib/styles/forms/forms.scss';

	section {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;

		h2 {
			@include forms.form_header;
		}

		form {
			@include forms.form;
			overflow-y: auto;

			div.form-field {
				@include forms.form_field;
				margin: 0;

				label {
					@include forms.form_field_label;
				}

				input {
					@include forms.form_field_text_input;
				}
			}

			button {
				// TODO: standardize save buttons
				margin-top: 1rem;
				min-height: 2rem;
				height: 2rem;
				background-color: rebeccapurple;
				color: white;
				border: none;
				border-radius: 0.25rem;

				&:disabled {
					// TODO: standardize save buttons
					background-color: gray;
				}
			}
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
