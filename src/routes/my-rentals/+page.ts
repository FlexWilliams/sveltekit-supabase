import { Logger } from '$lib/logging/logger';
import type { MyRental } from '$lib/rental/model/rental';
import type { PageLoad } from './$types';

const loader = `[My Rentals Layout Load]`;

export const load: PageLoad = async ({ fetch }) => {
	Logger.debug(`${loader}: Fetching incoming and outgoing rentals...`);

	let incomingRentals: MyRental[] | null = null;
	let outgoingRentals: MyRental[] | null = null;

	const incomingResponse = await fetch(`/api/my-rentals/incoming`);
	if (incomingResponse.ok) {
		incomingRentals = (await incomingResponse.json()) as MyRental[];
	}

	const outgoingResponse = await fetch(`/api/my-rentals/outgoing`);
	if (outgoingResponse.ok) {
		outgoingRentals = (await outgoingResponse.json()) as MyRental[];
	}

	Logger.debug(`${loader}: Successfully fetched incoming and outgoing rentals!`);

	return { incomingRentals, outgoingRentals };
};
