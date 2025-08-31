import { ApiLogger } from '$lib/logging/api-logger';
import { stuffToDb, type Stuff, type StuffEdit } from '$lib/stuff/model/stuff';
import {
	badRequest,
	forbidden,
	requiredFieldsMissing,
	unknown
} from '$lib/web/http/error-response';
import { prettyJson } from '$lib/web/http/response';
import type { RequestHandler } from '@sveltejs/kit';

const logger = new ApiLogger(`My Stuff [id] Default Photo API`);

export const PUT: RequestHandler = async ({
	request,
	params,
	locals: { supabase, safeGetSession }
}) => {
	logger.setRequestType('PUT');

	const { user } = await safeGetSession();
	if (!user) {
		return forbidden(`Error, user null.`);
	}

	const id = params.id;

	if (!id) {
		return badRequest(`Error, id null.`);
	}

	const { imageUrl } = await request.json();

	if (!imageUrl) {
		return requiredFieldsMissing(`Error, imageUrl null`);
	}

	const stuffEdit: Partial<StuffEdit> = {
		imageUrl,
		updatedOn: new Date().toISOString()
	};

	const { error } = await supabase
		.from('user_stuff')
		.update(stuffToDb(stuffEdit as Stuff))
		.eq('id', id);

	if (error) {
		logger.debug(`Unable to set default photo for My Stuff w/id: ${id}:\n ${prettyJson(error)}`);
		return unknown();
	}

	logger.debug(`Successfully set default photo for My Stuff w/id: ${id}.`);

	return new Response(null, {
		status: 204
	});
};
