import { ApiLogger } from '$lib/logging/api-logger';
import { RentalStatus, type RentalExchange } from '$lib/rental/model/rental';
import { badRequest, forbidden, noContent, unknown } from '$lib/web/http/http-responses';
import { prettyJson } from '$lib/web/http/response';
import type { RequestHandler } from '@sveltejs/kit';

const logger = new ApiLogger('Rentals [id] Exchange [Pickup] API');

export const GET: RequestHandler = async ({
	params,
	url,
	fetch,
	locals: { supabase, safeGetSession }
}) => {
	logger.setRequestType('GET');

	const { user } = await safeGetSession();
	if (!user) {
		return forbidden(`Error, user null.`);
	}

	const { id } = params;
	if (!id) {
		return badRequest(`Error, id null.`);
	}

	const pickupKey = url.searchParams.get('pickupKey');
	if (!pickupKey) {
		return badRequest(`Error, pickupKey null.`);
	}

	logger.debug(`${user?.id} attempting to pickup item for rental w/id ${id}...`);

	const rentalExchangeResponse = await fetch(`/api/rentals/${id}/exchange`);
	if (!rentalExchangeResponse.ok) {
		logger.error(`Rental exchange for rental w/id ${id} doesn't exist!`);
		return unknown();
	}

	const rentalExchange = (await rentalExchangeResponse.json()) as RentalExchange;
	if (rentalExchange.pickedUp) {
		return badRequest(`Item has already been picked up!`);
	} else if (rentalExchange?.pickupKey !== pickupKey) {
		return forbidden(`pickupKey invalid, please ask owner to regenerate key!`);
	}

	// TODO: run in transaction!
	const updatedRentalExchange = await supabase
		.from('rental_exchange')
		.update({ picked_up: true })
		.eq('id', id);
	if (updatedRentalExchange.error) {
		logger.error(
			`Unable to pick up item for rental w/id ${id}:\n${prettyJson(updatedRentalExchange.error)}`
		);
		return unknown();
	}

	const updatedRental = await supabase
		.from('user_rentals')
		.update({ pickup_date: new Date().toISOString(), status: RentalStatus.Rented })
		.eq('id', id);
	if (updatedRental.error) {
		logger.error(
			`Unable to update rental w/id ${id} to RENTED status:\n${prettyJson(updatedRental.error)}`
		);
		logger.error(`Data cleanup required for rental exchange w/id ${id}...`);
		return unknown();
	}

	logger.debug(`${user?.id} successfully picked up item for rental w/id ${id}...`);

	return noContent();
};
