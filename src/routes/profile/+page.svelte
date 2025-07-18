<script lang="ts">
	import { enhance } from '$app/forms';
	import checkmark from '$lib/assets/images/checkmark.svg';
	import gear from '$lib/assets/images/gear.svg';
	import { ToastrService } from '$lib/toastr/services/ToastrService.js';
	import { untrack } from 'svelte';
	import { fade } from 'svelte/transition';

	let { form, data } = $props();
	let { supabase } = $derived(data);

	let profilePic: File | null = $state(null);

	let userName: string | null = $state(null);

	let saving = $state(false);

	let loadingImage = $state(false);

	function handleProfilePicChange(event: Event): void {
		loadingImage = true;

		const files: FileList = (event.target as any)?.files;

		if (!files || files.length === 0) {
			return;
		}

		profilePic = files.item(0);

		loadingImage = false;
	}

	$effect(() => {
		if (form?.success) {
			untrack(() => {
				ToastrService.alert(`Profile Saved!`);
				userName = form?.profile?.userName;
			});
		}
	});
</script>

<h2>My Profile</h2>
<form
	name="user-profile"
	method="POST"
	action="?/updateProfile"
	use:enhance
	enctype="multipart/form-data"
>
	<div>
		<div class="form-field">
			<label for="username">Username:</label>
			<input id="username" name="username" bind:value={userName} autocomplete="off" />
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
			{#if profilePic}
				<img src={checkmark} alt="Gear icon" class="spinner" transition:fade />
			{:else if loadingImage}
				<img src={gear} alt="Gear icon" class="spinner" transition:fade />
			{/if}
		</div>
	</div>

	<button type="submit" class="save" disabled={!userName || saving}>Save</button>
</form>

<style lang="scss">
	@use '../../lib/styles/forms/forms.scss';
	@use '../../lib/styles/animations/spin.scss';

	h2 {
		@include forms.form_header;
	}

	form {
		@include forms.form;

		button.save {
			align-self: flex-end;
			margin-right: 1rem;
			padding: 0.5rem 1rem;
			border-radius: 0.25rem;
			background-color: rebeccapurple;
			color: white;
			border: none;

			&:disabled {
				background-color: gray;
			}
		}
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

		img {
			max-height: 3rem;
			max-width: 3rem;
		}
	}

	img.spinner {
		@include spin.spin360;
	}
</style>
