import { Logger } from '$lib/logging/logger';
import type { MyRental } from '$lib/rental/model/rental';
import { unknown } from '$lib/web/http/http-responses';
import type { PageLoad } from './$types';

const loader = `[My Rentals Layout Load]`;

export const load: PageLoad = async ({ fetch, url }) => {
	Logger.debug(`${loader}: Fetching incoming and outgoing rentals...`);

	let rentals: MyRental[] | null = null;

	const outgoing = url.searchParams.get('outgoing');

	if (outgoing && outgoing.toLocaleLowerCase() == 'true') {
		const outgoingResponse = await fetch(`/api/my-rentals/outgoing`);
		if (!outgoingResponse.ok) {
			Logger.error(`${loader}: Error occurred fetching incoming rentals`);
			return unknown();
		}

		rentals = (await outgoingResponse.json()) as MyRental[];
	} else {
		const incomingResponse = await fetch(`/api/my-rentals/incoming`);
		if (!incomingResponse.ok) {
			Logger.error(`${loader}: Error occurred fetching incoming rentals`);
			return unknown();
		}
		rentals = (await incomingResponse.json()) as MyRental[];
	}

	Logger.debug(`${loader}: Successfully fetched incoming and outgoing rentals!`);

	return { rentals };
};
