<script lang="ts">
	import avatar from '$lib/assets/images/avatars/avatar.png';
	import checkmark from '$lib/assets/images/checkmark.svg';
	import gear from '$lib/assets/images/gear.svg';
	import { profileState, profileState$$setProfilePic } from '$lib/state/profile-state.svelte.js';
	import { ToastrService } from '$lib/toastr/services/ToastrService.js';
	import { fade } from 'svelte/transition';
	let { data } = $props();

	let profilePic: Blob | null = $derived(profileState.profilePic);

	let profilePicLoading: boolean = $derived(profileState.profilePicLoading);

	let newProfilePic: Blob | null = $state(null);

	let profilePicUrl: string | null = $derived.by(() =>
		newProfilePic
			? URL.createObjectURL(newProfilePic)
			: profilePic
				? URL.createObjectURL(profilePic)
				: null
	);

	let newUserName: string | null = $state(data?.userMeta?.userName);

	let saving = $state(false);

	let loadingImage = $state(false);

	let formError: string | null = $state(null);

	function handleProfilePicChange(event: Event): void {
		loadingImage = true;

		const files: FileList = (event.target as any)?.files;

		if (!files || files.length === 0) {
			return;
		}

		newProfilePic = files.item(0);

		loadingImage = false;
	}

	function onFormSubmission(this: XMLHttpRequest) {
		saving = false;

		if (this.status === 204 && !this.response) {
			if (newProfilePic) {
				profileState$$setProfilePic(newProfilePic);
				newProfilePic = null;
			}

			formError = null;
			ToastrService.alert(`Profile Saved!`);
		} else if (this.response) {
			const response = JSON.parse(this.response);
			if (response?.error as string) {
				formError = response.error;
			} else {
				formError = null;
			}
		}
	}

	async function handleSaveClick(event: Event): Promise<void> {
		event.preventDefault();

		if (!newUserName) {
			return;
		}

		saving = true;

		const formData = new FormData();
		formData.append('user_name', newUserName);

		if (newProfilePic) {
			formData.append('profile_pic', newProfilePic);
		}

		// TODO: Convert to fetch PUT /api/profile
		// See https://github.com/vercel/next.js/issues/73220
		const req = new XMLHttpRequest();
		req.addEventListener('load', onFormSubmission);
		req.open('PUT', '/api/profile');
		req.send(formData);
	}
</script>

<h2>My Profile</h2>

<form name="user-profile">
	<div class="form-controls">
		<div class="profile-pic">
			{#if profilePicLoading}
				<div class="image-loading-overlay">
					<p>Loading...</p>
				</div>
			{/if}
			<img src={profilePicUrl ?? avatar} alt="User profile avatar" />
		</div>

		<div class="form-errors">
			{#if formError}
				<p class="form-error">{formError}</p>
			{/if}
		</div>

		<div class="form-field">
			<label for="username">Username:</label>
			<input id="username" name="username" bind:value={newUserName} autocomplete="off" />
		</div>
		<div class="form-field row">
			<div>
				<label for="profile-pic">
					<button type="button" onclick={(e) => e?.currentTarget?.parentElement?.click()}>
						Add Profile Pic
					</button>
				</label>
				<input
					id="profile-pic"
					name="profile-pic"
					hidden
					type="file"
					accept="image/*"
					multiple={false}
					onchange={(evt) => handleProfilePicChange(evt)}
				/>
			</div>
			{#if newProfilePic}
				<img src={checkmark} alt="Checkmark icon" transition:fade />
			{:else if loadingImage}
				<img src={gear} alt="Gear icon" class="spinner" transition:fade />
			{/if}
		</div>
	</div>

	<div class="form-actions">
		<button type="button" class="cancel" disabled={saving} onclick={() => window.history.back()}
			>Cancel</button
		>
		<button type="submit" class="save" disabled={!newUserName || saving} onclick={handleSaveClick}
			>Save</button
		>
	</div>
</form>

<style lang="scss">
	@use '../../lib/styles/forms/forms.scss';
	@use '../../lib/styles/animations/spin.scss';

	h2 {
		@include forms.form_header;
	}

	form {
		@include forms.form;
		padding-top: 0;
	}

	.form-field {
		@include forms.form_field;

		label {
			@include forms.form_field_label;

			button {
				@include forms.form_field_label_button;
			}
		}

		input {
			@include forms.form_field_text_input;
		}
	}

	.form-field.row {
		@include forms.form_field_row;
		min-height: 3rem;

		img {
			max-height: 3rem;
			max-width: 3rem;
		}
	}

	.form-errors {
		@include forms.form_errors;
		justify-content: center;
	}

	img.spinner {
		@include spin.spin360;
	}

	div.form-controls {
		display: flex;
		flex-direction: column;
	}

	div.profile-pic {
		display: flex;
		justify-content: center;
		position: relative;

		div.image-loading-overlay {
			position: absolute;
			width: 100%;
			height: 100%;
			display: flex;
			align-items: center;
			justify-content: center;

			p {
				padding: 0.5rem 1rem;
				background-color: #ffffffc9;
				border-radius: 0.25rem;
			}
		}

		img {
			max-width: 7rem;
			max-height: 7rem;
			width: 7rem;
			height: 7rem;
			border-radius: 7rem;
		}
	}

	div.form-actions {
		@include forms.form_actions;

		button {
			margin: 0;
			padding: 0.5rem 1rem;
			border: none;
			border-radius: 0.25rem;

			&:disabled {
				background-color: gray;
			}
		}

		button.save {
			background-color: rebeccapurple;
			color: white;

			&:disabled {
				background-color: gray;
			}
		}
	}
</style>
