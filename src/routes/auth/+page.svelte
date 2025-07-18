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
				<input name="email" type="email" />
			</label>
		</div>
		<div class="form-field">
			<label>
				Password:
				<input name="password" type="password" />
			</label>
		</div>
	</div>
	<div class="form-actions">
		<button formaction="?/signup">Sign up</button>
		<button type="submit">Login</button>
	</div>
</form>

<style lang="scss">
	@use '../../lib/styles/forms/forms.scss';

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
	}
</style>
