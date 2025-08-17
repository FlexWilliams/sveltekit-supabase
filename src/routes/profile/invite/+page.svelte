<script lang="ts">
	import { Logger } from '$lib/logging/logger';
	import { ToastrService } from '$lib/toastr/services/ToastrService';

	let email: string | null = $state(null);

	let sendingInvite: boolean = $state(false);

	function clearForm(): void {
		const form = document.getElementById('invite-friend') as HTMLFormElement;
		form?.reset();
	}

	async function sendInvite(event: Event): Promise<void> {
		event.preventDefault(); // TODO: use as enhancemment with form use:enhance!
		email = (document.getElementById('email') as HTMLInputElement)?.value;

		if (!email) {
			return;
		}

		sendingInvite = true;

		const response = await fetch(`/api/invite`, {
			method: 'POST',
			body: JSON.stringify({
				email
			}),
			headers: {
				'Content-Type': 'application/json'
			}
		});

		if (!response.ok) {
			Logger.error(`Error sending invite!`);
			ToastrService.error(`There was an error sending the invite.`);
		} else {
			ToastrService.alert(`Invite sent!\nAwaiting confirmation.`);
			clearForm();
		}

		sendingInvite = false;
	}
</script>

<form id="invite-friend" name="invite-friend">
	<div class="form-field">
		<label for="email">Email:</label>
		<input id="email" type="email" autocomplete="email" bind:value={email} />
	</div>

	<button type="button" class="cancel" onclick={() => window.history.back()}>Cancel</button>
	<button type="submit" onclick={sendInvite} disabled={!email || sendingInvite}>Send Invite</button>
</form>

<style lang="scss">
	@use '../../../lib/styles/forms/forms.scss';

	form {
		@include forms.form;
		justify-content: flex-start;

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

			box-shadow:
				rgba(0, 0, 0, 0.1) 0px 4px 6px -1px,
				rgba(0, 0, 0, 0.06) 0px 2px 4px -1px;
		}

		button.cancel {
			color: black;
			background-color: #cddc39;
		}
	}
</style>
