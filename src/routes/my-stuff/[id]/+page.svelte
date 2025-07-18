<script lang="ts">
	import type { Stuff } from '$lib/stuff/components/model/stuff.js';

	let { data } = $props();

	let stuff = $derived.by(() => (data.stuff.length > 0 ? data.stuff[0] : ({} as Stuff)));
</script>

<section>
	<h2>{stuff?.name}</h2>
</section>

<style lang="scss">
	section {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;

		h2 {
			text-align: center;
		}
	}
</style>
