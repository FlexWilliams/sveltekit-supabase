<script>
	import { afterNavigate, goto } from '$app/navigation';
	import { onMount } from 'svelte';

	let { children } = $props();

	let onDetailPage = $state(true);

	onMount(() => {
		afterNavigate((e) => {
			const route = e.to?.route?.id;
			onDetailPage = route === '/my-stuff/new' || route === '/my-stuff/[id]';
		});
	});
</script>

<section>
	{@render children()}

	{#if !onDetailPage}
		<button
			type="button"
			aria-label="Add item to your Stuff"
			class="add-item"
			onclick={() => goto('/my-stuff/new')}>+</button
		>
	{/if}
</section>

<style lang="scss">
	@use '../../lib/styles/layout/panel.scss';
	@use '../../lib/styles/overlay/shadows.scss';

	section {
		@include panel.panel;
		display: flex;
		flex-direction: column;
		position: relative;

		button.add-item {
			position: absolute;
			top: 0.5rem;
			right: 0.5rem;
			display: flex;
			justify-content: center;
			align-items: center;
			width: 3rem;
			height: 3rem;
			border-radius: 3rem;
			border: none;
			background-color: #ffeb3b;
			font-weight: bold;
			@include shadows.boxShadow;
		}
	}
</style>
