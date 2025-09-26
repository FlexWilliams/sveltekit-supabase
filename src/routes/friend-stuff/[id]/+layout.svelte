<script lang="ts">
	import { goto, invalidate } from '$app/navigation';
	import type { ChatGroup } from '$lib/chat/model/chat';
	import { Logger } from '$lib/logging/logger';
	import StuffPhoto from '$lib/photo/components/StuffPhoto.svelte';
	import RentalActions from '$lib/rental/component/RentalActions.svelte';
	import { RentalStatus, type MyRental } from '$lib/rental/model/rental';
	import type { Stuff } from '$lib/stuff/model/stuff';
	import { ToastrService } from '$lib/toastr/services/ToastrService';

	let { children, data } = $props();

	let userId = $derived(data?.user?.id || null);

	let stuff: Stuff | null = $derived(data.stuff);

	let rental: MyRental | null = $derived(data.rental);

	let chatGroups: ChatGroup[] | null = $derived(data.chatGroups);

	let renting: boolean = $state(false);

	let cancelling: boolean = $state(false);

	let approving: boolean = $state(false);

	let rejecting: boolean = $state(false);

	async function handleRentClick(): Promise<void> {
		renting = true;

		const rentalResponse = await fetch('/api/my-rentals', {
			method: 'POST',
			body: JSON.stringify({ stuffId: stuff?.id }),
			headers: {
				'Content-Type': 'application/json'
			}
		});

		if (rentalResponse.ok) {
			ToastrService.alert(`Item Added to My Rentals.\nAwaiting approval!`);
			goto('/my-rentals');
		} else {
			Logger.error(`There was an error renting this item!`);
		}

		renting = false;
	}

	async function handleCancelReservation(): Promise<void> {
		cancelling = true;

		const response = await fetch(`/api/my-rentals/${rental?.id}/cancel`, {
			method: 'POST'
		});

		if (response.ok) {
			rental = null;
			ToastrService.alert(`Your reservation was\nCancelled!`);
		} else {
			ToastrService.error(`There was an error cancelling your reservation.`);
			Logger.error(`There was an error cancelling My Rental w/id ${rental?.id}`);
		}

		cancelling = false;
	}

	async function handleApproveReservation(): Promise<void> {
		approving = true;

		const response = await fetch(`/api/my-rentals/${rental?.id}/approve`, {
			method: 'POST'
		});

		if (response.ok) {
			if (rental) {
				rental = { ...rental, status: RentalStatus.Approved };

				invalidate('friend:stuff');
			}
			ToastrService.alert(`The rental request was\nApproved!`);
		} else {
			ToastrService.error(`There was an error approving the rental request.`);
		}

		approving = false;
	}

	async function handleRejectReservation(): Promise<void> {
		rejecting = true;

		const response = await fetch(`/api/my-rentals/${rental?.id}/reject`, {
			method: 'POST'
		});

		if (response.ok) {
			rental = null;
			ToastrService.alert(`The rental request was\nRejected!`);
		} else {
			ToastrService.error(`There was an error rejecting the rental request.`);
		}

		rejecting = false;
	}
</script>

<section>
	{#if stuff}
		<h3>
			{#if stuff?.userIsOwner}
				<span>Your</span>
			{:else}
				<span>{stuff?.userMeta ? `${stuff?.userMeta?.userName}'s` : ''} </span>
			{/if}
			<span>{stuff.name}</span>
		</h3>

		<section class="stuff-body">
			<section class="photo">
				<StuffPhoto
					cacheKey={`stuff-${stuff?.id}`}
					fetchUrl={`/api/stuff/${stuff.id}/photo/${stuff?.imageUrl}`}
					photoName={stuff?.name}
				/>
			</section>
			<p>{stuff.description}</p>
		</section>

		<RentalActions
			{stuff}
			{userId}
			{rental}
			{cancelling}
			{renting}
			{approving}
			{rejecting}
			{handleRentClick}
			{handleApproveReservation}
			{handleRejectReservation}
			{handleCancelReservation}
		/>
	{:else}
		<p>Sorry, this item doesn't seem to exist!</p>
		<a href="/search">Back to Search</a>
	{/if}

	{#if !stuff?.userIsOwner || (chatGroups && chatGroups?.length > 0)}
		<div class="chat">
			{#if chatGroups && chatGroups?.length > 0}
				<div class="chat-group-count">{chatGroups?.length}</div>
			{/if}
			<a type="button" href={`./${stuff?.id}/chat`}>Chat</a>
		</div>
	{/if}
</section>

{@render children?.()}

<style lang="scss">
	@use '../../../lib/styles/layout/panel.scss';
	@use '../../../lib/styles/responsive.scss';
	@use '../../../lib/styles/overlay/z-index.scss';

	section {
		@include panel.panel;
		display: flex;
		flex-direction: column;
		align-items: center;
		overflow: hidden;
		position: relative;

		h3 {
			height: calc(20% - 2rem);
			max-height: calc(20% - 2rem);
			display: flex;
			flex-direction: column;
			align-items: center;
			margin: 1rem 0;
		}

		section.stuff-body {
			height: 55%;
			max-height: 55%;
			overflow-y: auto;

			section.photo {
				min-width: 90%;
				width: 90%;
				min-height: 10rem;
				height: 10rem;
				border-radius: 0.25rem;
			}

			p {
				text-align: center;
			}
		}

		a {
			display: flex;
			justify-content: center;
			color: black;
		}

		div.chat {
			position: absolute;
			right: 1rem;
			bottom: 0.5rem;
			z-index: z-index.$chat-button-z-index;
			height: 5rem;
			width: 5rem;
			display: flex;
			align-items: center;
			justify-content: center;

			div.chat-group-count {
				background-color: red;
				height: 1.5rem;
				width: 1.5rem;
				top: 0.75rem;
				right: 0.75rem;
				position: absolute;
				border-radius: 1rem;
				display: flex;
				justify-content: center;
				align-items: center;
			}

			a {
				height: 3rem;
				width: 3rem;
				border-radius: 3rem;
				border: none;
				font-size: 0.85rem;
				background-color: #cddc39;
				text-align: center;
				display: flex;
				justify-content: center;
				align-items: center;
				text-decoration: none;
			}
		}
	}

	@media screen and (min-width: responsive.$tablet-width) {
		section {
			h3 {
				font-size: 2.5rem;
			}

			section.photo {
				min-height: 20rem;
				height: 20rem;
			}
		}
	}

	@media screen and (max-width: responsive.$mini-width) {
		section {
			div.chat {
				align-items: flex-end;
				justify-content: flex-end;

				div.chat-group-count {
					top: 1.5rem;
					right: 0rem;
				}
			}
		}
	}
</style>
