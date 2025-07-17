<script>
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';

	let { data } = $props();
	let { supabase } = $derived(data);

	async function logout() {
		const { error } = await supabase.auth.signOut();
		if (error) {
			console.error(error);
		}

		goto('/');
	}

	onMount(async () => {
		await logout();
	});
</script>
