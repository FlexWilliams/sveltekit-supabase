import { ApiLogger } from '$lib/logging/api-logger';
import { stuffFromDbList, type StuffFromDb } from '$lib/stuff/model/stuff';
import { badRequest, forbidden, notFound, ok } from '$lib/web/http/http-responses';
import { prettyJson } from '$lib/web/http/response';
import type { RequestHandler } from '@sveltejs/kit';

const logger = new ApiLogger('Stuff [id] API');

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

	logger.debug(`Fetching stuff w/id: ${id}...`);

	const columns = `id,
					user_id,
					created_on,
					name,
					trust_level,
					description,
					available,
					image_url,
					rental_id,
					user_meta (
						user_name
					)`;

	const { data, error } = await supabase
		.from('user_stuff')
		.select(columns)
		.eq('id', id)
		.order('created_on');

	if (error) {
		logger.error(`Error occurred: ${prettyJson(error)}`);
		return notFound();
	}

	logger.debug(`Successfully fetched stuff w/id: ${id}...`);

	let stuff = stuffFromDbList(data as StuffFromDb[], user?.id)[0];

	return ok(stuff);
};
