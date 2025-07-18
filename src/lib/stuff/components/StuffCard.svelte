<script lang="ts">
	import bluray from '$lib/assets/images/inventory-items/bluray.png';
	let { stuff, handleClick, handleEdit } = $props();
</script>

<button class="card" onclick={handleClick}>
	<h3>{stuff?.name}</h3>

	<img src={bluray} alt={`${stuff.name}`} />
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
		background-color: gray;
		width: 100%;
		height: 100%;
		border: none;
		@include variables.border-radius-panel;

		h3 {
			text-align: center;
			font-size: 1.5rem;
			margin-bottom: 2rem;
		}

		img {
			max-width: 80%;
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
		background-color: #ffeb3b;
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
				@include variables.border-radius-panel;
			}
		}

		button.edit-item {
			bottom: 0.5rem;
			right: 0.5rem;
		}
	}
</style>
