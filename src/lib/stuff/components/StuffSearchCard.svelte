<script lang="ts">
	import { goto } from '$app/navigation';
	import type { Stuff } from '../model/stuff';

	interface StuffSearchCardProps {
		stuff: Stuff;
	}

	let { stuff }: StuffSearchCardProps = $props();
</script>

<article>
	<h3>
		<span>{stuff?.userMeta ? `${stuff?.userMeta?.userName}'s` : ''}</span>
		<span> {stuff?.name}</span>
	</h3>
	<p>{stuff?.description}</p>
	<button onclick={() => goto(`/friend-stuff/${stuff?.id}`)}>Rent</button>
</article>

<style lang="scss">
	article {
		padding: 0 1rem;
		display: flex;
		flex-direction: column;
		align-items: center;
		h3 {
			text-align: center;
			display: flex;
			flex-direction: column;
			align-items: center;
		}
	}
</style>
