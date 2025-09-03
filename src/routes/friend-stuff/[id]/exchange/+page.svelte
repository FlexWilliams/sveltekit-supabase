<script lang="ts">
	import { afterNavigate, goto } from '$app/navigation';
	import { Logger } from '$lib/logging/logger.js';
	import RentalExchange from '$lib/rental/component/RentalExchange.svelte';
	import {
		RentalStatus,
		type RentalExchangeDropOff,
		type RentalExchangeReturn
	} from '$lib/rental/model/rental.js';
	import { userState } from '$lib/state/user-state.svelte.js';
	import { ToastrService } from '$lib/toastr/services/ToastrService.js';
	import { prettyJson } from '$lib/web/http/response.js';
	import { extractSearchParamValue } from '$lib/web/http/search.js';
	import { onMount } from 'svelte';

	let { data } = $props();

	let stuff = $derived(data.stuff);
	let rental = $derived(data.rental);
	let isRenter: boolean = $derived(userState.id === stuff?.userId);
	let pickupKey: string | null = $state(null);
	let returnKey: string | null = $state(null);
	let loading = $state(false);

	async function handleGenerateQr() {
		loading = true;

		if (rental?.status === RentalStatus.Approved && isRenter) {
			const response = await fetch(`/api/rentals/${rental?.id}/exchange/dropoff`, {
				method: 'POST'
			});

			if (!response.ok) {
				ToastrService.error(
					`There was an error attempting to dropoff via the system. Try again or manually set in admin portal`
				);
				return;
			}

			let dropoff = (await response.json()) as RentalExchangeDropOff;
			pickupKey = dropoff.pickupKey || null;
		} else if (rental?.status === RentalStatus.Rented && !isRenter) {
			const response = await fetch(`/api/rentals/${rental?.id}/exchange/return`, {
				method: 'POST'
			});

			if (!response.ok) {
				ToastrService.error(
					`There was an error attempting to return via the system. Try asking the owner to update manually on their end.`
				);
				return;
			}

			let dropoff = (await response.json()) as RentalExchangeReturn;
			returnKey = dropoff.returnKey || null;
		} else {
			Logger.error(`Unable to generate qr code, bad state`);
		}

		loading = false;
	}

	async function handleScanQr() {
		if (isRenter) {
			const response = await fetch(
				`/api/rentals/${rental?.id}/exchange/accept?returnKey=${returnKey}`
			);
			if (!response.ok) {
				ToastrService.error(
					`There was an error trying to accept the item via the system.\nPlease try again or update yourself in the admin portal.`
				);
				return;
			}

			ToastrService.alert(`You successfully accepted the rental Return.\nHappy Sharing!`);
		} else {
			const response = await fetch(
				`/api/rentals/${rental?.id}/exchange/pickup?pickupKey=${pickupKey}`
			);
			if (!response.ok) {
				ToastrService.error(
					`There was an error trying to return the item via the system.\nPlease try again or ask the owner to update themselves.`
				);
				return;
			}

			ToastrService.alert(`You successfully picked up your Rental.\nHappy Sharing!`);
		}

		goto(`/friend-stuff/${stuff?.id}`, { invalidateAll: true });
	}

	onMount(() => {
		afterNavigate(async () => {
			const pickupKeyParam = extractSearchParamValue('pickupKey');
			const returnKeyParam = extractSearchParamValue('returnKey');

			Logger.debug(prettyJson({ pickupKey: pickupKeyParam, returnKey: returnKeyParam }));

			if (pickupKeyParam && !isRenter) {
				pickupKey = pickupKeyParam;
				await handleScanQr();
			} else if (returnKeyParam && isRenter) {
				returnKey = returnKeyParam;
				await handleScanQr();
			}
		});
	});
</script>

<RentalExchange
	{stuff}
	{rental}
	{loading}
	{handleGenerateQr}
	{handleScanQr}
	{pickupKey}
	{returnKey}
/>
