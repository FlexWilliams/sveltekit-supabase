<script lang="ts">
	import { Logger } from '$lib/logging/logger';
	import { ToastrService } from '$lib/toastr/services/ToastrService';

	let { form } = $props();

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

{#if form?.success}
	<p class="form-success">Invite sent to {form?.email}!</p>
{:else if form?.error}
	<p class="form-error">There was an error sending an invite to {form?.email}.</p>
	<p class="form-error">Please try again</p>
{/if}

<form id="invite-friend" name="invite" method="POST" action="?/invite">
	<div class="form-field">
		<label for="email">Email:</label>
		<input id="email" type="email" name="email" autocomplete="email" bind:value={email} required />
	</div>

	<div class="form_action_button_container">
		<button type="submit" onclick={sendInvite} disabled={sendingInvite}>Send Invite</button>
		<a href="/profile">Cancel</a>
	</div>
</form>

<style lang="scss">
	@use '../../../lib/styles/forms/forms.scss';
	@use '../../../lib/styles/button/button.scss';

	.form-success {
		margin: 0 1rem;
	}

	.form-error {
		margin: 0 1rem;
		color: red;
	}

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

		.form_action_button_container {
			@include forms.form_action_button_container;

			a {
				@include button.button_link;
				background-color: #ccc;
			}
		}
	}
</style>
