<script lang="ts">
	import { invalidate } from '$app/navigation';
	import Footer from '$lib/layout/components/Footer.svelte';
	import Header from '$lib/layout/components/Header.svelte';
	import {
		profileState,
		profileState$$setProfilePic,
		profileState$$setProfilePicLoading
	} from '$lib/state/profile-state.svelte.js';
	import Toastr from '$lib/toastr/components/Toastr.svelte';
	import { onDestroy, onMount } from 'svelte';

	let { data, children } = $props();
	let { user } = $derived(data);
	let { session, supabase } = $derived(data);

	let profilePic: Blob | null = $derived(profileState.profilePic);

	let subscriptions: any[] = [];

	async function fetchProfilePic(): Promise<void> {
		if (!user) {
			return;
		}

		profileState$$setProfilePicLoading(true);

		const pic = await fetch('/api/profile-pic');

		if (pic.ok) {
			let buffer = await pic.arrayBuffer();

			const newProfilePic = new Blob([buffer]);
			profileState$$setProfilePic(newProfilePic);
		}

		profileState$$setProfilePicLoading(false);
	}

	onMount(async () => {
		const { data } = supabase.auth.onAuthStateChange((_, newSession) => {
			if (newSession?.expires_at !== session?.expires_at) {
				invalidate('supabase:auth');
			}
		});

		subscriptions.push(data.subscription);

		await fetchProfilePic();
	});

	onDestroy(() => {
		subscriptions.forEach((sub) => sub?.unsubscribe());
	});
</script>

<Header {user} {profilePic} />
<main>
	{@render children?.()}
</main>
<Footer />
<Toastr />

<style lang="scss">
	main {
		height: calc(70% - 2rem);
		max-height: calc(70% - 2rem);
		overflow: hidden;
		width: calc(100% - 4rem);
		padding: 1rem;
		margin: 0 1rem;
	}
</style>
