<script>
	import { invalidate } from '$app/navigation';
	import Footer from '$lib/layout/components/Footer.svelte';
	import Header from '$lib/layout/components/Header.svelte';
	import Toastr from '$lib/toastr/components/Toastr.svelte';
	import { onMount } from 'svelte';

	let { data, children } = $props();
	let { user } = $derived(data);
	let { session, supabase } = $derived(data);

	onMount(() => {
		const { data } = supabase.auth.onAuthStateChange((_, newSession) => {
			if (newSession?.expires_at !== session?.expires_at) {
				invalidate('supabase:auth');
			}
		});

		return () => data.subscription.unsubscribe();
	});
</script>

<Header {user} />
<main>
	{@render children?.()}
</main>
<Footer />
<Toastr />

<style lang="scss">
	main {
		height: 70%;
		width: calc(100% - 4rem);
		padding: 1rem;
		margin: 0 1rem;
	}
</style>
