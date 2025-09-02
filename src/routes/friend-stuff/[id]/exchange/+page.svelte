<script>
	import RentalExchange from '$lib/rental/component/RentalExchange.svelte';

	let { data } = $props();

	let stuff = $derived(data.stuff);
	let rental = $derived(data.rental);
</script>

<RentalExchange {stuff} {rental} />
