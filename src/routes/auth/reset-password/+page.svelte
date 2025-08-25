<script lang="ts">
	import { goto } from '$app/navigation';
	import { ToastrService } from '$lib/toastr/services/ToastrService';

	let saving = $state(false);
	let password: string | null = $state(null);
	let confirmPassword: string | null = $state(null);
	let passwordsMatch = $derived.by(
		() => !!password && !!confirmPassword && password === confirmPassword
	);

	function handlePasswordChange(): void {
		const { value } = document.getElementById(`password`) as HTMLInputElement;
		password = value || null;
	}

	function handleConfirmPasswordChange(): void {
		const { value } = document.getElementById(`confirm-password`) as HTMLInputElement;
		confirmPassword = value || null;
	}

	async function resetPassword(): Promise<void> {
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
	<form id="reset-password">
		<input name="email" type="email" autocomplete="username" hidden />

		<label>
			<span>Password:</span>
			<input
				type="password"
				id="password"
				name="password"
				autocomplete="new-password"
				onkeyup={handlePasswordChange}
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
			/>
		</label>

		<button type="button" onclick={() => window.history.back()}>Cancel</button>

		<button type="submit" disabled={!passwordsMatch || saving} onclick={resetPassword}
			>Update Password</button
		>
	</form>
</section>

<style lang="scss">
	@use '../../../lib/styles/forms/forms.scss';
	@use '../../../lib/styles/responsive.scss';
	@use '../../../lib/styles/layout/panel.scss';

	section {
		@include panel.panel;

		h2 {
			@include forms.form_header;
		}

		form {
			@include forms.form;
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: flex-start;
			gap: 1rem;

			label {
				display: flex;
				flex-direction: column;
				width: 90%;

				input {
					width: calc(100% - 8px);
					height: 2rem;
				}
			}

			button {
				width: 90%;
				min-height: 2rem;
				background-color: #cddc39;
				border: none;
				border-radius: 0.25rem;
				padding: 1rem 0;

				&:disabled {
					background-color: #8080804a;
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
