<script lang="ts">
	import { afterNavigate, goto } from '$app/navigation';
	import { userState } from '$lib/state/user-state.svelte';
	import { onMount } from 'svelte';

	let { data, children } = $props();

	let userId: string | null = $derived(data?.user?.id || userState.id);

	let route: string | null = $state(null);

	onMount(() => {
		afterNavigate((e) => {
			route = e.to?.route?.id || null;

			if (!userId) {
				goto(`/auth/login`);
			}
		});
	});
</script>

<section class="panel">
	{@render children()}
</section>

<style lang="scss">
	@use '../../lib/styles/layout/panel.scss';

	section {
		@include panel.panel;
	}
</style>
