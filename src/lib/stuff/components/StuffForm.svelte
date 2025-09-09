<script lang="ts">
	import { goto } from '$app/navigation';
	import { Logger } from '$lib/logging/logger';
	import type { PhotoNameAndUrl } from '$lib/photo/model/photo';
	import NewStuffPhotoCarousel from '$lib/stuff/components/NewStuffPhotoCarousel.svelte';
	import type { Stuff } from '$lib/stuff/model/stuff';
	import { ToastrService } from '$lib/toastr/services/ToastrService';
	import type { ActionData } from '../../../routes/my-stuff/[id]/$types';

	interface StuffFormProps {
		form?: ActionData; // TODO: this could potentially be two different types, wiill require import aliasing
		stuff?: Stuff;
		photos: PhotoNameAndUrl[];
		handleRemove?(event: Event): Promise<void>;
		handleUpdate?: () => void;
		handleSaveStart?: () => void;
		handleSaveFinish?: () => void;
		removePhoto?: (photoName: string) => void;
	}

	let {
		stuff,
		photos,
		handleRemove,
		handleUpdate,
		handleSaveStart,
		handleSaveFinish,
		removePhoto,
		form
	}: StuffFormProps = $props();

	let saving = $state(false);

	let newPhotos: File[] = $state([]);

	let name: string | null = $state(stuff?.name || null);

	let trustLevel: number = $state(stuff?.trustLevel || 5);

	let description: string | null = $state(stuff?.description || null);

	let removing = $state(false);

	// let saveButtonDisabled: boolean = $derived.by(() => { // TODO: set onMount for better UX (i.e., js support!)
	// 	return (
	// 		!name ||
	// 		((!photos || photos.length === 0) && newPhotos.length === 0) ||
	// 		trustLevel < 1 ||
	// 		trustLevel > 10 ||
	// 		saving
	// 	);
	// });

	async function handleAddResponse(this: XMLHttpRequest): Promise<void> {
		if (this.status === 201 && this.response) {
			const newItem = JSON.parse(this.response) as Stuff;
			Logger.debug(`${JSON.stringify(newItem)}`);

			ToastrService.alert(`New Item Saved!`);

			if (handleSaveFinish) {
				handleSaveFinish();
			}

			goto(`/my-stuff/${newItem.id}`);
		} else if (this.response) {
			Logger.error(`Unable to save new Stuff:\n${this.response}`);

			ToastrService.error(`Oops!\nThere was an error saving your new Stuff.`);
		}

		saving = false;
	}

	async function handleUpdateResponse(this: XMLHttpRequest): Promise<void> {
		if (this.status === 204) {
			ToastrService.alert(`Item Updated!`);

			newPhotos.length = 0;
			const photoInput = document.getElementsByName('photos')[0] as HTMLInputElement;
			if (photoInput) {
				photoInput.value = '';
			}

			if (handleSaveFinish) {
				handleSaveFinish();
			}

			if (handleUpdate) {
				handleUpdate();
			}
		} else {
			ToastrService.error(`Oops!\nThere was an error updating your Stuff!`);
		}

		saving = false;
	}

	function getFormData(
		name: string,
		newPhotos: File[],
		trustLevel: number,
		description: string | null
	): FormData {
		const formData = new FormData();

		formData.append('name', name);

		formData.append('photo_count', `${$state.snapshot(photos)?.length}`);

		formData.append('new_photo_count', `${newPhotos.length}`);

		newPhotos.forEach((p, idx) => formData.append(`new_photo_${idx}`, p));

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

		newPhotos = []; // TODO: push/selectively remove instead of recreate each time!

		for (let i = 0; i < files.length; i++) {
			const photo = files.item(i);

			if (photo) {
				newPhotos.push(photo);
			}
		}
	}

	async function handlePhotoRemove(photoName: string): Promise<void> {
		if (removePhoto) {
			removePhoto(photoName);
		}
	}

	async function handlePhotoSetDefault(photoName: string): Promise<void> {
		const response = await fetch(`/api/my-stuff/${stuff?.id}/default-photo`, {
			method: 'PUT',
			body: JSON.stringify({ imageUrl: photoName }),
			headers: {
				'Content-Type': 'application/json'
			}
		});

		if (response.ok) {
			ToastrService.alert(`Updated default photo!`);
		} else {
			ToastrService.error(`Error updating default photo!`);
		}
	}

	async function handleFormSubmission(event: Event): Promise<void> {
		event.preventDefault();

		saving = true;

		if (handleSaveStart) {
			handleSaveStart();
		}

		if (!name || (!photos && !newPhotos) || !trustLevel) {
			return;
		}

		const formData = getFormData(name, $state.snapshot(newPhotos), trustLevel, description);

		// TODO: Convert to fetch PUT /api/profile
		// See https://github.com/vercel/next.js/issues/73220
		const req = new XMLHttpRequest();

		if (stuff?.id) {
			req.addEventListener('load', handleUpdateResponse);
			req.open('PUT', `/api/my-stuff/${stuff.id}`);
		} else {
			req.addEventListener('load', handleAddResponse);
			req.open('POST', '/api/my-stuff');
		}

		req.send(formData);
	}
</script>

{#if form?.success}
	<p class="form-success">Stuff Updated!</p>
{:else if form?.error}
	{#if form?.invalid}
		<p class="form-error">Required fields missing!</p>
	{:else}
		<p class="form-error">There was an error saving your stuff</p>
		<p class="form-error">Please try again</p>
	{/if}
{/if}

<form
	name="add-new-stuff"
	method="POST"
	action={stuff?.id ? '?/update' : '?/add'}
	enctype="multipart/form-data"
>
	<input type="hidden" name="stuff-id" value={stuff?.id} />

	<div class="form-field">
		<label>
			<span>Name*:</span>
			<input type="text" name="name" bind:value={name} />
		</label>
	</div>

	<NewStuffPhotoCarousel {photos} {handlePhotoRemove} {handlePhotoSetDefault} />

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
			<textarea name="description" bind:value={description}></textarea>
		</label>
	</div>

	<button type="submit" onclick={handleFormSubmission}>Save</button>
	{#if stuff?.id}
		<button type="button" class="remove" popovertarget="confirm-remove-stuff">Remove?</button>
	{/if}
</form>

<dialog id="confirm-remove-stuff" popover="auto">
	<h3>
		<span>Are you sure you want to remove this item from your Stuff?</span>
	</h3>
	<form name="remove-stuff" method="POST" action="?/remove">
		<input type="hidden" name="stuff-id" value={stuff?.id} />
		<button type="button" popovertarget="confirm-remove-stuff">No, Keep</button>
		<button type="submit" onclick={handleRemove} disabled={removing}>Yes, Remove</button>
	</form>
</dialog>

<style lang="scss">
	@use '../../../lib/styles/overlay/shadows.scss';
	@use '../../../lib/styles/forms/forms.scss';
	@use '../../../lib/styles/button/button.scss';
	@use '../../../lib/styles/dialog/dialog.scss';
	@use '../../../lib/styles/responsive.scss';

	.form-success {
		@include forms.form_status_text;
	}

	.form-error {
		@include forms.form_status_error_text;
	}

	form {
		@include forms.form;
		height: calc(85% - 3rem);
		padding: 1rem 1rem 2rem 1rem;
		overflow-y: auto;

		div.form-field {
			@include forms.form_field;
			margin: 0.5rem 0;

			label {
				@include forms.form_field_label;
			}

			input {
				@include forms.form_field_text_input;

				&::-webkit-file-upload-button {
					border: none;
				}
			}

			textarea {
				@include forms.form_field_text_area;
			}
		}

		button {
			@include button.secondary_button;
			margin-bottom: 1rem;
		}

		button[type='submit'] {
			@include button.primary_button;
		}
	}

	dialog {
		@include dialog.dialog;
	}

	@media screen and (min-width: responsive.$tablet-width) {
		form {
			width: calc(100% - 6rem);
			padding: 1rem 3rem 2rem 3rem;

			div.form-field {
				label {
					font-size: 2rem;
				}

				input {
					height: 3rem;
					font-size: 1.25rem;

					&::-webkit-file-upload-button {
						height: 3rem;
					}
				}

				textarea {
					height: 10rem;
					font-size: 1.25rem;
				}
			}

			button {
				min-height: 3rem;
				font-size: 1.25rem;
			}
		}
	}
</style>
