<script lang="ts">
	import { afterNavigate, goto, invalidate } from '$app/navigation';

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

	let profilePic: string | null = $derived(profileState.profilePic);

	let subscriptions: any[] = [];

	async function fetchProfilePic(): Promise<void> {
		if (!user) {
			return;
		}

		profileState$$setProfilePicLoading(true);

		const pic = await fetch('/api/profile-pic');

		if (pic.ok) {
			let signedUrl = await pic.text();
			profileState$$setProfilePic(signedUrl);
		}

		profileState$$setProfilePicLoading(false);
	}

	onMount(async () => {
		const { data } = supabase.auth.onAuthStateChange((_, newSession) => {
			if (newSession?.expires_at !== session?.expires_at) {
				invalidate('supabase:auth');
			}
		});
		afterNavigate((e) => {
			const route = e.to?.route?.id;

			if (!user && route !== '/auth') {
				goto('/auth'); // client side redirecting if hook.server doesn't catch (in case of preloading data links)
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
		height: calc(70%);
		max-height: calc(70%);
		overflow: hidden;
		width: calc(100% - 4rem);
		padding: 0 1rem;
		margin: 0 1rem;
	}
</style>
