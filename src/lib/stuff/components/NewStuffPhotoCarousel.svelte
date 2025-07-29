<script lang="ts">
	interface Props {
		photos: File[];
		handlePhotoRemove: (photoName: string) => void;
	}

	let { photos, handlePhotoRemove }: Props = $props();
	let photoUrls: string[] = $derived.by(() =>
		photos ? photos.map((p) => URL.createObjectURL(p)) : []
	);
</script>

<ul>
	{#each photoUrls as photo, idx}
		<li>
			<img src={photo} alt={`Photo`} />
			<button
				aria-label="Remove Photo?"
				class="close"
				onclick={() => handlePhotoRemove(photos[idx]?.name)}>X</button
			>
		</li>
	{:else}
		<li class="no-photos">
			<p>No Photos</p>
		</li>
	{/each}
</ul>

<style lang="scss">
	ul {
		list-style: none;
		margin: 1rem 0;
		padding: 0;
		display: flex;
		min-height: 10rem;
		height: 10rem;
		max-height: 10rem;
		overflow-x: auto;
		overflow-y: hidden;

		li {
			height: 100%;
			min-width: 100%;
			margin-right: 1rem;
			border-radius: 0.25rem;
			position: relative;

			&:last-of-type {
				margin-right: 0;
			}

			img {
				width: 100%;
				height: 100%;
				border-radius: 0.25rem;
			}

			button.close {
				position: absolute;
				top: 0.5rem;
				right: 0.5rem;
				width: 2rem;
				height: 2rem;
				border: none;
				border-radius: 2rem;
			}
		}

		li.no-photos {
			width: 100%;
			text-align: center;
		}
	}
</style>
