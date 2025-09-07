<script lang="ts">
	import { Logger } from '$lib/logging/logger';
	import MyRentalCard from '$lib/rental/component/MyRentalCard.svelte';
	import type { MyRental } from '$lib/rental/model/rental';
	import { ToastrService } from '$lib/toastr/services/ToastrService';

	let { data } = $props();

	let rentals: MyRental[] = $derived(data.rentals || []);

	let activeTab: string = $state('incoming');

	async function handleCancelReservation(id?: number): Promise<void> {
		const response = await fetch(`/api/my-rentals/${id}/cancel`, {
			method: 'POST'
		});

		if (response.ok) {
			await fetchIncomingRentals();
			ToastrService.alert(`Your reservation was\nCancelled!`);
		} else {
			Logger.error(`There was an error deleting My Rental w/id ${id}`);
		}
	}

	async function handleRejectReservation(id?: number): Promise<void> {
		const response = await fetch(`/api/my-rentals/${id}/reject`, {
			method: 'POST'
		});

		if (response.ok) {
			await fetchOutGoingRentals();
			ToastrService.alert(`Your reservation request was\nRejected!`);
		} else {
			Logger.error(`There was an error rejecting the reservation for My Rental w/id ${id}`);
		}
	}

	async function handleApproveReservation(id?: number, callback?: Function): Promise<void> {
		const response = await fetch(`/api/my-rentals/${id}/approve`, {
			method: 'POST'
		});

		if (response.ok) {
			await fetchOutGoingRentals();
			ToastrService.alert(`You approved the rental request!\nArrange for a time to exchange.`);
		} else {
			ToastrService.error(`There was an error approving the rental request.`);
		}

		if (callback) {
			callback();
		}
	}
</script>

<section>
	<h2>Rentals</h2>

	<menu>
		<li>
			<a
				href="/my-rentals?outgoing=false"
				class:active={activeTab !== 'outgoing'}
				onclick={() => (activeTab = 'incoming')}
			>
				<span>Incoming</span>
			</a>
		</li>
		<li>
			<a
				href="/my-rentals?outgoing=true"
				class:active={activeTab === 'outgoing'}
				onclick={() => (activeTab = 'outgoing')}
			>
				<span>Outgoing</span>
			</a>
		</li>
	</menu>

	<ul>
		{#each rentals as rental (rental?.id)}
			<li>
				<MyRentalCard
					{rental}
					{handleCancelReservation}
					{handleRejectReservation}
					{handleApproveReservation}
				/>
			</li>
		{:else}
			<li>
				<p>You don't have any active rentals</p>
				<a href="/search">Search for things to rent here</a>
			</li>
		{/each}
	</ul>
</section>

<style lang="scss">
	@use '../../lib/styles/layout/panel.scss';
	@use '../../lib/styles/responsive.scss';

	section {
		@include panel.panel;

		h2 {
			text-align: center;
			height: 10%;
		}

		menu {
			display: flex;
			justify-content: space-around;
			list-style: none;
			margin: 0;
			margin-bottom: 1rem;
			padding: 0;

			li {
				padding: 0;
				margin: 0;
				text-align: center;
				display: flex;
				align-items: center;
				border-radius: 0.25rem;
				min-height: 3rem;

				a {
					background-color: gray;
					color: white;
					padding: 1rem;
					border: none;
					border-radius: 0.25rem;
					font-size: 1rem;
					width: 100%;

					span {
						padding: 0 0.5rem;
						text-decoration: none;
					}
				}

				a.active {
					background-color: rebeccapurple;

					span {
						text-decoration: underline;
					}
				}
			}
		}

		p {
			text-align: center;
		}

		ul {
			height: calc(70% - 2rem);
			list-style: none;
			margin: 0;
			padding: 0;
			padding-bottom: 2rem;
			overflow-y: auto;

			li {
				margin: 0;
				padding: 0 1rem;

				a {
					display: flex;
					justify-content: center;
					color: black;
				}
			}
		}
	}

	@media screen and (min-width: responsive.$tablet-width) {
		section {
			h2 {
				font-size: 2.5rem;
			}
		}
	}
</style>
