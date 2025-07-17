<script>
	let { form } = $props();
</script>

{#if form?.error}
	<p>{form?.error}</p>
{/if}
<form method="POST" action="?/login">
	<label>
		Email
		<input name="email" type="email" />
	</label>
	<label>
		Password
		<input name="password" type="password" />
	</label>
	<button>Login</button>
	<button formaction="?/signup">Sign up</button>
</form>
