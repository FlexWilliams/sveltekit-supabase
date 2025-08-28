<script>
	import { goto } from '$app/navigation';
	import { userState$$setId } from '$lib/state/user-state.svelte.js';
	import { ToastrService } from '$lib/toastr/services/ToastrService.js';
	import { onMount } from 'svelte';

	let { data } = $props();
	let { supabase } = $derived(data);

	async function logout() {
		const { error } = await supabase.auth.signOut();
		if (error) {
			console.error(error);
		}

		userState$$setId(null);

		ToastrService.alert(`Signed out!`);

		goto('/auth/login');
	}

	onMount(async () => {
		await logout();
	});
</script>
