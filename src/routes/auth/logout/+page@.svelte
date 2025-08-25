<script>
	import { goto } from '$app/navigation';
	import { ToastrService } from '$lib/toastr/services/ToastrService.js';
	import { onMount } from 'svelte';

	let { data } = $props();
	let { supabase } = $derived(data);

	async function logout() {
		const { error } = await supabase.auth.signOut();
		if (error) {
			console.error(error);
		}

		ToastrService.alert(`Signed out!`);

		goto('/auth/login');
	}

	onMount(async () => {
		await logout();
	});
</script>
