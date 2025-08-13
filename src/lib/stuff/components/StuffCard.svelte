<script lang="ts">
	import bluray from '$lib/assets/images/inventory-items/bluray.png';
	import { onMount } from 'svelte';
	import type { Stuff } from '../model/stuff';

	interface StuffCardProps {
		stuff: Stuff;
		handleClick: (evt: Event) => void;
		handleEdit: (id: string) => void;
	}

	let { stuff, handleClick, handleEdit }: StuffCardProps = $props();

	let photo: string | null = $state(null);

	async function fetchPhoto(): Promise<void> {
		if (stuff?.imageUrl) {
			const response = await fetch(`/api/stuff/${stuff?.id}/photo/${stuff.imageUrl}`);

			if (response.ok) {
				const buffer = await response.arrayBuffer();
				photo = URL.createObjectURL(new Blob([buffer]));
			}
		}
	}

	onMount(async () => {
		await fetchPhoto();
	});
</script>

<button class="card" onclick={handleClick}>
	<h3>{stuff?.name}</h3>

	<img src={photo || bluray} alt={`${stuff.name}`} />
</button>
<button
	type="button"
	aria-label={`Edit ${stuff?.name}`}
	class="edit-item"
	onclick={() => handleEdit(stuff.id)}>Edit</button
>

<style lang="scss">
	@use '../../styles/variables.scss';
	@use '../../styles/responsive.scss';
	@use '../../styles/overlay/shadows.scss';

	button.card {
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 1rem;
		background-color: transparent;
		width: 100%;
		height: 100%;
		border: none;
		@include variables.border-radius-panel;
		@include shadows.boxShadow;

		h3 {
			text-align: center;
			font-size: 1.5rem;
			margin-bottom: 2rem;
		}

		img {
			max-width: 80%;
			max-height: 80%;
			@include variables.border-radius-panel;
		}
	}

	button.edit-item {
		position: absolute;
		bottom: 1rem;
		right: 1rem;
		width: 3rem;
		height: 3rem;
		border-radius: 3rem;
		border: none;
		background-color: #cddc39;
		@include shadows.boxShadow;
	}

	@media screen and (max-width: responsive.$mini-width) {
		button.card {
			h3 {
				margin-bottom: 1rem;
				font-size: 1rem;
			}

			img {
				max-width: 70%;
				max-height: 70%;
				@include variables.border-radius-panel;
			}
		}

		button.edit-item {
			bottom: 0.5rem;
			right: 0.5rem;
		}
	}

	@media screen and (min-width: responsive.$tablet-width) {
		button.card {
			h3 {
				font-size: 2.5rem;
			}
		}

		button.edit-item {
			width: 5rem;
			height: 5rem;
			font-size: 1.5rem;
		}
	}
</style>
