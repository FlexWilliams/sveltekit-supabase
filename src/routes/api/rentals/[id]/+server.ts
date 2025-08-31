import { ApiLogger } from '$lib/logging/api-logger';
import { rentalFromDbList } from '$lib/rental/model/rental';
import { badRequest, forbidden, ok, unknown } from '$lib/web/http/error-response';
import { prettyJson } from '$lib/web/http/response';
import type { RequestHandler } from '@sveltejs/kit';

const logger = new ApiLogger('Rentals API');

export const GET: RequestHandler = async ({ params, locals: { supabase, safeGetSession } }) => {
	logger.setRequestType('GET');

	const { user } = await safeGetSession();
	if (!user) {
		return forbidden(`Error, user null.`);
	}

	const { id } = params;
	if (!id) {
		return badRequest(`Error, id null.`);
	}

	logger.debug(`Attempting to get rental w/id: ${id}...`);

	const { data, error } = await supabase.from('user_rentals').select().eq('id', id);

	if (error || data?.length === 0) {
		logger.error(`Error occurred: ${prettyJson(error)}`);
		return unknown();
	}

	logger.debug(`Successfully fetched rental w/id: ${id}`);

	const rental = rentalFromDbList(data)[0];

	return ok(rental);
};
