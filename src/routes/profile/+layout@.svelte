<script lang="ts">
	import { afterNavigate } from '$app/navigation';
	import { onMount } from 'svelte';

	let { children } = $props();

	let route: string | null = $state(null);

	onMount(() => {
		afterNavigate((e) => {
			route = e.to?.route?.id || null;
		});
	});
</script>

<section class="panel">
	<h2>
		{#if route === '/profile'}
			My Profile
		{:else if route === '/profile/update'}
			Update Profile
		{:else if route === '/profile/invite'}
			Invite Friend
		{/if}
	</h2>
	{@render children()}
</section>

<style lang="scss">
	@use '../../lib/styles/layout/panel.scss';

	section {
		@include panel.panel;
	}

	h2 {
		text-align: center;
	}
</style>
