<script lang="ts">
	import type { Stuff } from '../model/stuff';

	interface StuffSearchCardProps {
		stuff: Stuff;
	}

	let { stuff }: StuffSearchCardProps = $props();
</script>

<article>
	<h3>{stuff?.name}</h3>
</article>
