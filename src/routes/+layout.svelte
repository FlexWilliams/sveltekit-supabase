<script lang="ts">
	import { afterNavigate, invalidate } from '$app/navigation';

	import Footer from '$lib/layout/components/Footer.svelte';
	import Header from '$lib/layout/components/Header.svelte';
	import { Logger } from '$lib/logging/logger.js';
	import {
		profileState,
		profileState$$setProfilePic,
		profileState$$setProfilePicLoading
	} from '$lib/state/profile-state.svelte.js';
	import { userState$$setId } from '$lib/state/user-state.svelte.js';
	import Toastr from '$lib/toastr/components/Toastr.svelte';
	import { onDestroy, onMount, untrack } from 'svelte';

	let { data, children } = $props();

	let { user, session, supabase } = $derived(data);

	let profilePic: string | null = $derived(profileState.profilePic);

	let subscriptions: any[] = [];

	$effect(() => {
		const userId = user?.id || null;

		untrack(() => {
			userState$$setId(userId);
		});
	});

	async function fetchProfilePic(): Promise<void> {
		if (!user || profilePic) {
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
				Logger.debug(`New session created!`);
				invalidate('supabase:auth');
			}
		});

		afterNavigate((e) => {
			const route = e.to?.route?.id;

			if (!user && route !== '/auth/login') {
				Logger.debug(
					`layout.svelte: afterNavigate() called, no user and attempting to go to private route!`
				);
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
		height: calc(80% - 2rem);
		max-height: calc(80% - 2rem);
		overflow: hidden;
		width: calc(100% - 4rem);
		padding: 0 1rem;
		margin: 0 1rem;
	}
</style>
