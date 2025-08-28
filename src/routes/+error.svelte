<script lang="ts">
	import { page } from '$app/state';
	import InternalError from '$lib/error/pages/InternalError.svelte';
	import NotFound from '$lib/error/pages/NotFound.svelte';
</script>

<section>
	{#if page.status === 404}
		<NotFound />
	{:else}
		<InternalError />
	{/if}
</section>

<style lang="scss">
	@use '../lib/styles/layout/panel.scss';

	section {
		@include panel.panel;
	}
</style>
