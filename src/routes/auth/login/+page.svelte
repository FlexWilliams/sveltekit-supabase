<script>
	let { form } = $props();
</script>

<h2>Login</h2>

<form method="POST" action="?/login">
	<div>
		<div class="form-errors">
			<p>
				{#if form?.error}
					<span>{form?.error}</span>
				{/if}
			</p>
		</div>
		<div class="form-field">
			<label>
				Email:
				<input name="email" type="email" autocomplete="username" />
			</label>
		</div>
		<div class="form-field">
			<label>
				Password:
				<input name="password" type="password" autocomplete="current-password" />
			</label>
		</div>
	</div>
	<div class="form-actions">
		<button type="button" formaction="?/signup">Sign up</button>
		<button type="submit" class="submit">Login</button>
	</div>
</form>

<a href="/auth/magic-link">Send Magic Link</a>

<style lang="scss">
	@use '../../../lib/styles/forms/forms.scss';
	@use '../../../lib/styles/responsive.scss';

	h2 {
		@include forms.form_header;
	}

	form {
		@include forms.form;
		justify-content: space-around;
		padding-top: 0;
		height: initial;
	}

	.form-errors {
		@include forms.form_errors;
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

	@media screen and (min-width: responsive.$tablet-width) {
		form {
			max-width: 30rem;
		}

		h2 {
			margin-top: 5rem;
			font-size: 2.5rem;
		}

		.form-field {
			label {
				font-size: 2rem;
			}

			input {
				height: 3rem;
				border-radius: 0.25rem;
				border: 1px solid #f3f3f3;
				box-shadow:
					rgba(50, 50, 93, 0.25) 0px 2px 5px -1px,
					rgba(0, 0, 0, 0.3) 0px 1px 3px -1px;
				margin-bottom: 2rem;
				font-size: 1.25rem;
			}
		}

		.form-actions {
			button {
				height: 3rem;
				width: 9rem;
				font-size: 1.25rem;
			}
		}
	}

	a {
		margin: 0 2rem;
	}
</style>
