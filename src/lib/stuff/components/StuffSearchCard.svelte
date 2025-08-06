<script lang="ts">
	import { goto } from '$app/navigation';
	import type { Stuff } from '../model/stuff';

	interface StuffSearchCardProps {
		stuff: Stuff;
	}

	let { stuff }: StuffSearchCardProps = $props();
</script>

<article>
	<h3>{stuff?.name}</h3>
	<p>{stuff?.userId}</p>
	<button onclick={() => goto(`/friend-stuff/${stuff?.id}`)}>Rent</button>
</article>

<style lang="scss">
	article {
		padding: 0 1rem;
		h3 {
			text-align: center;
		}
	}
</style>
