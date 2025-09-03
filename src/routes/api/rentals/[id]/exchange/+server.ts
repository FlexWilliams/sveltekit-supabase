import { ApiLogger } from '$lib/logging/api-logger';
import { rentalExchangeFromDbList } from '$lib/rental/model/rental';
import { badRequest, forbidden, notFound, ok, unknown } from '$lib/web/http/error-response';
import { prettyJson } from '$lib/web/http/response';
import type { RequestHandler } from '@sveltejs/kit';

const logger = new ApiLogger('Rentals [id] Exchange API');

export const GET: RequestHandler = async ({
	params,
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

	logger.debug(`Attempting to get rental exchange for rental w/id: ${id}...`);

	const { data, error } = await supabase.from('rental_exchange').select().eq('id', id);

	if (error) {
		logger.error(`Error occurred: ${prettyJson(error)}`);
		return unknown();
	}

	if (data?.length === 0) {
		return notFound();
	}

	logger.debug(`Successfully fetched rental exchange for rental w/id: ${id}!`);

	const rentalExchange = rentalExchangeFromDbList(data)[0];

	return ok(rentalExchange);
};
