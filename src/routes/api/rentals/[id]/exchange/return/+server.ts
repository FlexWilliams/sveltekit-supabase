import { ApiLogger } from '$lib/logging/api-logger';
import {
	RentalStatus,
	type MyRental,
	type RentalExchange,
	type RentalExchangeReturn
} from '$lib/rental/model/rental';
import { badRequest, forbidden, ok, unknown } from '$lib/web/http/http-responses';
import type { RequestHandler } from '@sveltejs/kit';

const logger = new ApiLogger('Rentals [id] Exchange [Return] API');

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

	logger.debug(`${user?.id} attempting to return item for rental w/id ${id}...`);

	const rentalResponse = await fetch(`/api/rentals/${id}`);
	if (!rentalResponse.ok) {
		logger.error(`Error, unable to fetch my rental.`);
		return unknown();
	}

	const rental = (await rentalResponse.json()) as MyRental;
	if (rental?.status !== RentalStatus.Rented) {
		logger.error(`Unable to return item as it has already been dropped off or cancelled.`);
		return badRequest(`Item already dropped off or cancelled`);
	}

	const rentalExchangeResponse = await fetch(`/api/rentals/${id}/exchange`);
	if (!rentalExchangeResponse.ok) {
		logger.error(`Rental exchange for rental w/id ${id} doesn't exist!`);
		return unknown();
	}

	const rentalExchange = (await rentalExchangeResponse.json()) as RentalExchange;
	if (rentalExchange.returned) {
		return badRequest(`Item has already been returned!`);
	}

	logger.debug(`Successfully fetched rental exchange!`);
	logger.debug(`Returning return key ${rentalExchange?.returnKey}...`);

	const rentalReturn: RentalExchangeReturn = { returnKey: rentalExchange?.returnKey };
	return ok(rentalReturn);
};
