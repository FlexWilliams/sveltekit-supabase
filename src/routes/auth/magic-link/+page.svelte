<script lang="ts">
	import { ToastrService } from '$lib/toastr/services/ToastrService';

	let email: string | null = $state(null);

	let verifyingToken: boolean = $state(false);

	let sendingMagicLink: boolean = $state(false);

	async function sendMagicLink(event: Event): Promise<void> {
		event.preventDefault();

		sendingMagicLink = true;

		const response = await fetch('/api/auth/magic-link', {
			method: 'POST',
			body: JSON.stringify({ email }),
			headers: {
				'Content-Type': 'application/json'
			}
		});

		if (response.ok) {
			ToastrService.alert(`Magic Link Sent!\nLookout for an email.`);

			email = '';
		} else {
			ToastrService.error(`Error sending Magic Link!\nPlease try again.`);
		}

		sendingMagicLink = false;
	}
</script>

<section>
	<h2>Send Magic Link</h2>
	<form>
		<div class="form-field">
			<label>
				Email:
				<input type="email" autocomplete="username" bind:value={email} />
			</label>
		</div>

		<div class="form-actions">
			<button
				type="submit"
				class="submit"
				disabled={!email || sendingMagicLink}
				onclick={sendMagicLink}>Send</button
			>
		</div>
	</form>
</section>
{#if verifyingToken}
	<div class="loader">
		<p>Loading...</p>
	</div>
{/if}

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
			justify-content: space-around;
			padding-top: 0;
			height: initial;
		}

		.form-field {
			@include forms.form_field;
			margin: 0.5rem 1rem;

			label {
				@include forms.form_field_label;
			}

			input {
				@include forms.form_field_text_input;
			}
		}

		.form-actions {
			@include forms.form_actions;

			button {
				border: none;
				border-radius: 0.25rem;
				box-shadow:
					rgba(50, 50, 93, 0.25) 0px 2px 5px -1px,
					rgba(0, 0, 0, 0.3) 0px 1px 3px -1px;
			}

			button.submit {
				background-color: #cddc39;
			}
		}
	}

	div.loader {
		position: absolute;
		top: 0;
		left: 0;
		height: 100%;
		width: 100%;
		z-index: 1;
		background-color: white;
		opacity: 50%;
		display: flex;
		justify-content: center;
		align-items: center;

		p {
			font-size: 2rem;
		}
	}
</style>
