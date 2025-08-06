<script lang="ts">
	import type { MyRental } from '../model/rental';

	interface MyRentalCardProps {
		rental: MyRental;
		handleCancelReservation: (id?: number) => void;
	}

	let { rental, handleCancelReservation }: MyRentalCardProps = $props();
</script>

<article>
	<h3>{rental?.itemName}</h3>
	<p>Status: <span>Pending Approval</span></p>

	<button onclick={() => handleCancelReservation(rental?.id)}>Cancel Reservation</button>
</article>

<style lang="scss">
	article {
		background-color: white;
		border: none;
		border-radius: 0.25rem;
		padding: 1rem;
		margin: 1rem 0;
	}
</style>
