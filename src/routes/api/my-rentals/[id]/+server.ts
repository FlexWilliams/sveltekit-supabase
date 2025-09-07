import { ApiLogger } from '$lib/logging/api-logger';
import { rentalFromDb } from '$lib/rental/model/rental';
import { badRequest, forbidden, notFound, ok, unknown } from '$lib/web/http/http-responses';
import { prettyJson } from '$lib/web/http/response';
import type { RequestHandler } from '@sveltejs/kit';

const logger = new ApiLogger(`My Rentals [id] API`);

export const GET: RequestHandler = async ({ params, locals: { supabase, safeGetSession } }) => {
	logger.setRequestType('GET');

	const { user } = await safeGetSession();
	if (!user) {
		return forbidden(`Error, user null.`);
	}

	const { id } = params;
	if (!id) {
		return badRequest(`Error, id null`);
	}

	const { data, error } = await supabase.from('user_rentals').select().eq('id', id);

	if (error) {
		logger.error(`Error fetching my rental w/id: ${id}: ${prettyJson(error)}`);
		return unknown();
	}

	if (!data || data.length === 0) {
		return notFound(`My Rental w/id ${id} not found.`);
	}

	logger.debug(`Successfully fetched my rental w/id: ${id}`);

	return ok(rentalFromDb(data[0]));
};
