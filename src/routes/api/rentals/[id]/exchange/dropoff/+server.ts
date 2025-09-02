import { ApiLogger } from '$lib/logging/api-logger';
import {
	rentalExchangeFromDbList,
	RentalStatus,
	type MyRental,
	type RentalExchange,
	type RentalExchangeDropOff
} from '$lib/rental/model/rental';
import { badRequest, forbidden, ok, unknown } from '$lib/web/http/error-response';
import { prettyJson } from '$lib/web/http/response';
import type { RequestHandler } from '@sveltejs/kit';

const logger = new ApiLogger('Rentals [id] Exchange [Dropoff] API');

export const POST: RequestHandler = async ({
	params,
	fetch,
	locals: { supabase, safeGetSession }
}) => {
	logger.setRequestType('POST');

	const { user } = await safeGetSession();
	if (!user) {
		return forbidden(`Error, user null.`);
	}

	const { id } = params;
	if (!id) {
		return badRequest(`Error, id null.`);
	}

	const rentalResponse = await fetch(`/api/rentals/${id}`);
	if (!rentalResponse.ok) {
		logger.error(`Error, unable to fetch my rental.`);
		return unknown();
	}

	const rental = (await rentalResponse.json()) as MyRental;
	if (rental?.status !== RentalStatus.Approved) {
		logger.error(`Unable to dropoff item as has already been dropped off or cancelled.`);
	}

	let rentalExchange: RentalExchange | null = null;

	const rentalExchangeResponse = await fetch(`/api/rentals/${id}/exchange`);
	if (rentalExchangeResponse.status === 404) {
		logger.debug(`Rental exchange doesn't exist yet for rental w/id ${id}, creating one...`);

		const newRentalExchange = await supabase.from('rental_exchange').insert({ id }).select();
		if (newRentalExchange.error || newRentalExchange?.data?.length === 0) {
			logger.error(`Error creating new rental exchange!\n${prettyJson(newRentalExchange.error)}`);
			return unknown();
		} else {
			rentalExchange = rentalExchangeFromDbList(newRentalExchange?.data)[0];
		}
	} else if (!rentalExchangeResponse.ok) {
		return unknown();
	} else {
		rentalExchange = (await rentalExchangeResponse.json()) as RentalExchange;
	}

	logger.debug(`Successfully fetched rental exchange!`);
	logger.debug(`Returning pickup key ${rentalExchange?.pickupKey}...`);

	const dropoff: RentalExchangeDropOff = { pickupKey: rentalExchange?.pickupKey };
	return ok(dropoff);
};
