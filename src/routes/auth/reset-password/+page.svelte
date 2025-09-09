<script lang="ts">
	import { goto } from '$app/navigation';
	import { ToastrService } from '$lib/toastr/services/ToastrService';

	let { form } = $props();
	let saving = $state(false);
	let password: string | null = $state(null);
	let confirmPassword: string | null = $state(null);
	// let passwordsMatch = $derived.by(
	// 	() => !!password && !!confirmPassword && password === confirmPassword
	// ); // TODO: review how to do this without js!

	function handlePasswordChange(): void {
		const { value } = document.getElementById(`password`) as HTMLInputElement;
		password = value || null;
	}

	function handleConfirmPasswordChange(): void {
		const { value } = document.getElementById(`confirm-password`) as HTMLInputElement;
		confirmPassword = value || null;
	}

	async function resetPassword(event: Event): Promise<void> {
		event.preventDefault();

		saving = true;

		const response = await fetch(`/api/auth/reset-password`, {
			method: 'POST',
			body: JSON.stringify({ password, confirmPassword }),
			headers: {
				'Content-Type': 'application/json'
			}
		});

		saving = false;

		if (!response.ok) {
			ToastrService.error(`There was an issue resetting your password.`);
		} else {
			ToastrService.alert(`Password updated successfully!`);
			goto(`/`);
		}
	}
</script>

<section>
	<h2>Reset Password</h2>

	{#if form?.success}
		<p class="form-success">Password reset succesfully!</p>
	{:else if form?.error}
		{#if form?.invalid}
			<p class="form-error">The password combination did not match</p>
		{:else}
			<p class="form-error">There was an error resetting your password</p>
			<p class="form-error">Please try again</p>
		{/if}
	{/if}

	<form id="reset-password" name="reset-password" method="POST" action="?/reset">
		<input name="email" type="email" autocomplete="username" hidden />

		<label>
			<span>Password:</span>
			<input
				type="password"
				id="password"
				name="password"
				autocomplete="new-password"
				onkeyup={handlePasswordChange}
				required
			/>
		</label>

		<label>
			<span>Confirm Password:</span>
			<input
				type="password"
				id="confirm-password"
				name="confirm-password"
				autocomplete="new-password"
				onkeyup={handleConfirmPasswordChange}
				required
			/>
		</label>

		<div class="form_action_button_container">
			<button type="submit" disabled={saving} onclick={resetPassword}>Update Password</button>
			<a href="/profile">Cancel</a>
		</div>
	</form>
</section>

<style lang="scss">
	@use '../../../lib/styles/forms/forms.scss';
	@use '../../../lib/styles/button/button.scss';
	@use '../../../lib/styles/responsive.scss';
	@use '../../../lib/styles/layout/panel.scss';

	section {
		@include panel.panel;

		h2 {
			@include forms.form_header;
		}

		.form-success {
			@include forms.form_status_text;
		}

		.form-error {
			@include forms.form_status_error_text;
		}

		form {
			@include forms.form;
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: flex-start;
			gap: 1rem;

			label {
				@include forms.form_field_label;
				display: flex;
				flex-direction: column;
				width: 90%;

				input {
					@include forms.form_field_text_input;
				}
			}

			.form_action_button_container {
				width: 90%;
				@include forms.form_action_button_container;

				a {
					@include button.button_link;
					background-color: #ccc;
				}
			}
		}
	}

	@media screen and (min-width: responsive.$tablet-width) {
		form {
			label {
				font-size: 1.5rem;
				input {
					height: 3rem;
				}
			}

			button {
				min-height: 3rem;
				font-size: 1.25rem;
			}
		}
	}
</style>
