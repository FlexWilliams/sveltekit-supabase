<script lang="ts">
	import StuffPhoto from '$lib/photo/components/StuffPhoto.svelte';
	import type { Stuff } from '../model/stuff';

	interface StuffCardProps {
		stuff: Stuff;
		handleClick: (evt: Event) => void;
	}

	let { stuff, handleClick }: StuffCardProps = $props();
</script>

<button class="card" onclick={handleClick}>
	<h3>{stuff?.name}</h3>

	<section class="photo">
		<StuffPhoto
			cacheKey={`stuff-${stuff?.id}`}
			fetchUrl={`/api/stuff/${stuff?.id}/photo/${stuff.imageUrl}`}
			photoName={stuff?.name}
		/>
	</section>
</button>
<a
	href={`/friend-stuff/${stuff?.id}`}
	aria-label={`View Posting of ${stuff?.name}`}
	class="view-posting">View Posting</a
>
<a href={`/my-stuff/${stuff?.id}`} aria-label={`Edit ${stuff?.name}`} class="edit-item">Edit</a>

<style lang="scss">
	@use '../../styles/variables.scss';
	@use '../../styles/responsive.scss';
	@use '../../styles/overlay/shadows.scss';
	@use '../../styles/layout/panel.scss';

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

		section.photo {
			max-width: 80%;
			max-height: 80%;
			@include variables.border-radius-panel;
		}
	}

	a.edit-item {
		@include panel.panel_close_button_link;
		top: auto;
		bottom: 1rem;
		right: 1rem;
		font-size: 0.85rem;
	}

	a.view-posting {
		position: absolute;
		top: auto;
		bottom: 1rem;
		right: auto;
		left: 1rem;
		width: 10rem;
		background-color: transparent;
		text-decoration: underline;
		color: black;
	}

	@media screen and (max-width: responsive.$mini-width) {
		button.card {
			h3 {
				margin-bottom: 1rem;
				font-size: 1rem;
			}

			section.photo {
				max-width: 70%;
				max-height: 70%;
				@include variables.border-radius-panel;
			}
		}

		a.edit-item {
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

		a.edit-item {
			width: 5rem;
			height: 5rem;
			font-size: 1.5rem;
		}
	}
</style>
