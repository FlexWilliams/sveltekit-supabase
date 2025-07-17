<script>
	let { data } = $props();
</script>

<h1>Vouch for Me</h1>
<nav>
	<ul>
		{#if !data?.user || !data.user.id}
			<li>
				<a href="/auth">Login</a>
			</li>
		{:else}
			<li>
				<a href="/private">Private</a>
			</li>
			<li>
				<a href="/auth/logout">Logout</a>
			</li>
		{/if}
	</ul>
</nav>

<style>
	h1 {
		text-align: center;
	}

	nav {
		display: flex;
		justify-content: flex-start;
		padding: 0 1rem;
	}
	nav ul {
		list-style: none;
		margin: 0;
		padding: 0;
		display: flex;
		gap: 1rem;
		justify-content: flex-end;
		width: 100%;
	}

	nav ul li {
		margin: 0;
		padding: 0;
	}
</style>
