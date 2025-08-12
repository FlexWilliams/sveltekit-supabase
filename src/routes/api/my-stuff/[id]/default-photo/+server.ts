import { Logger } from '$lib/logging/logger';
import { stuffToDb, type Stuff, type StuffEdit } from '$lib/stuff/model/stuff';
import {
	badRequest,
	forbidden,
	requiredFieldsMissing,
	unknown
} from '$lib/web/http/error-response';
import type { RequestHandler } from '@sveltejs/kit';

const API_NAME = 'My Stuff [id] Default Photo API';

export const PUT: RequestHandler = async ({
	request,
	params,
	locals: { supabase, safeGetSession }
}) => {
	const { user } = await safeGetSession();
	if (!user) {
		return forbidden(`${API_NAME} [PUT]: Unable to update My Stuff default photo, user null.`);
	}

	const id = params.id;

	if (!id) {
		return badRequest(`${API_NAME} [PUT]: Unable to update My Stuff default photo, id null.`);
	}

	Logger.debug(`${id}, ${user?.id}`);

	const { imageUrl } = await request.json();

	if (!imageUrl) {
		return requiredFieldsMissing(`${API_NAME} [PUT]: Unable to update My Stuff default photo.`);
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
		return unknown();
	}

	Logger.debug(`${API_NAME} [PUT]: Successfully set default photo for My Stuff w/id: ${id}.`);

	return new Response(null, {
		status: 204
	});
};
