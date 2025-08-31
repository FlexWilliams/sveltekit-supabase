import { ApiLogger } from '$lib/logging/api-logger';
import { type Stuff } from '$lib/stuff/model/stuff';
import { badRequest, ok, unknown } from '$lib/web/http/error-response';
import type { RequestHandler } from '@sveltejs/kit';

const logger = new ApiLogger(`Friend Stuff [id] API`);

export const GET: RequestHandler = async ({ params, fetch }) => {
	logger.setRequestType('GET');

	const { id } = params;
	if (!id) {
		return badRequest(`Error, id null.`);
	}

	logger.debug(`Fetching friend stuff w/id: ${id}...`);

	const response = await fetch(`/api/stuff/${id}`);

	if (response.ok) {
		const stuff = (await response.json()) as Stuff;

		logger.debug(`Successfully fetched friend stuff w/id: ${id}...`);

		return ok(stuff);
	} else {
		logger.debug(`Unable to fetch friend stuff w/id: ${id}...`);
		return unknown();
	}
};
