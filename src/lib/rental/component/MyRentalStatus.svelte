<script lang="ts">
	import { RentalStatus } from '../model/rental';

	let { rental } = $props();
</script>

{#if rental.isOwner}
	{#if rental?.status === RentalStatus.Reserved}
		<p>Status: <span>Awaiting Your Approval</span></p>
	{:else if rental?.status === RentalStatus.Cancelled}
		<p>Status: <span>Request was Cancelled by Rentee</span></p>
	{:else if rental?.status === RentalStatus.Rejected}
		<p>Status: <span>You Rejected the Request</span></p>
	{:else if rental?.status === RentalStatus.Approved}
		<p>Status: <span>You Approved the request, awaiting item exchange</span></p>
	{:else if rental?.status === RentalStatus.Rented}
		<p>Status: <span>This item is currently being rented out</span></p>
	{:else if rental?.status === RentalStatus.Returned}
		<p>Status: <span>You previously rented out this item</span></p>
	{/if}
{:else if rental?.status === RentalStatus.Reserved}
	<p>Status: <span>Pending Approval</span></p>
{:else if rental?.status === RentalStatus.Cancelled}
	<p>Status: <span>You Cancelled the Reservation</span></p>
{:else if rental?.status === RentalStatus.Rejected}
	<p>Status: <span>Owner Rejected the Request</span></p>
{:else if rental?.status === RentalStatus.Approved}
	<p>Status: <span>Owner Approved, arrange time for an Exchange!</span></p>
{:else if rental?.status === RentalStatus.Rented}
	<p>Status: <span>You are currently renting this!</span></p>
{:else if rental?.status === RentalStatus.Returned}
	<p>Status: <span>You previously rented this item</span></p>
{/if}

<style lang="scss">
</style>
