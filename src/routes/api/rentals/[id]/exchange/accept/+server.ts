import { ApiLogger } from '$lib/logging/api-logger';
import { RentalStatus, rentalFromDb, type RentalExchange } from '$lib/rental/model/rental';
import { getSupabaseServerClient } from '$lib/server/supabase/supabase';
import { badRequest, forbidden, noContent, unknown } from '$lib/web/http/error-response';
import { prettyJson } from '$lib/web/http/response';
import type { RequestHandler } from '@sveltejs/kit';

const logger = new ApiLogger('Rentals [id] Exchange [Accept] API');

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

	const returnKey = url.searchParams.get('returnKey');
	if (!returnKey) {
		return badRequest(`Error, returnKey null.`);
	}

	logger.debug(`${user?.id} attempting to accept return for rental w/id ${id}...`);

	const rentalExchangeResponse = await fetch(`/api/rentals/${id}/exchange`);
	if (!rentalExchangeResponse.ok) {
		logger.error(`Rental exchange for rental w/id ${id} doesn't exist!`);
		return unknown();
	}

	const rentalExchange = (await rentalExchangeResponse.json()) as RentalExchange;
	if (rentalExchange.returned) {
		return badRequest(`Item has already been returned and accepted by you.`);
	} else if (rentalExchange?.returnKey !== returnKey) {
		return forbidden(
			`returnKey invalid, please ask rentee to regenerate a key, or update yourself in the admin portal.`
		);
	}

	// TODO: run in transaction!
	const updatedRentalExchange = await supabase
		.from('rental_exchange')
		.update({ returned: true })
		.eq('id', id);
	if (updatedRentalExchange.error) {
		logger.error(
			`Unable to accept return for rental w/id ${id}:\n${prettyJson(updatedRentalExchange.error)}`
		);
		return unknown();
	}

	const updatedRental = await supabase
		.from('user_rentals')
		.update({ return_date: new Date().toISOString(), status: RentalStatus.Returned })
		.eq('id', id)
		.select();
	if (updatedRental.error) {
		logger.error(
			`Unable to update rental w/id ${id} to RETURNED status:\n${prettyJson(updatedRental.error)}`
		);
		logger.error(`Data cleanup required for rental exchange w/id ${id}...`);
		return unknown();
	}

	const rental = rentalFromDb(updatedRental?.data[0]);

	const supabaseElevated = getSupabaseServerClient();

	const friendStuffResponse = await supabaseElevated
		.from('user_stuff')
		.update({ rental_id: null })
		.eq('id', rental?.itemId);

	if (friendStuffResponse.error) {
		logger.error(`Error removing reservation hold on user_stuff item with id: ${rental?.itemId}`);
	}

	logger.debug(`${user?.id} successfully accepted return for rental w/id ${id}...`);

	logger.debug(`Another happy rental exchange amongst friends! Please share again!`);

	return noContent();
};
