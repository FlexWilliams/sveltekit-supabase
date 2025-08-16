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

<h2>Reset Password</h2>
<form id="reset-password">
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

	<button type="submit" disabled={!passwordsMatch || saving} onclick={resetPassword}
		>Update Password</button
	>
</form>

<style lang="scss">
	form {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		align-items: flex-start;

		label {
			display: flex;
			flex-direction: column;

			font-size: 1.5rem;
			input {
				width: 20rem;

				height: 2rem;
			}
		}

		button {
			width: 20rem;
			min-height: 3rem;
			font-size: 1.25rem;
			background-color: #cddc39;
			border: none;
			border-radius: 0.25rem;
			padding: 1rem 0;

			&:disabled {
				background-color: gray;
			}
		}
	}
</style>
