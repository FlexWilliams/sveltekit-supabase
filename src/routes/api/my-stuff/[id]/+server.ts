import { Logger } from '$lib/logging/logger';
import { stuffToDb, type Stuff, type StuffEdit } from '$lib/stuff/model/stuff';
import {
	badRequest,
	forbidden,
	requiredFieldsMissing,
	unknown
} from '$lib/web/http/error-response';
import type { RequestHandler } from '@sveltejs/kit';

const API_NAME = 'My Stuff [id] API';

export const PUT: RequestHandler = async ({
	request,
	params,
	locals: { supabase, safeGetSession }
}) => {
	const { user } = await safeGetSession();
	if (!user) {
		return forbidden(`${API_NAME} [DELETE]: Unable to delete My Stuff, user null.`);
	}

	const id = params.id;

	if (!id) {
		return badRequest(`${API_NAME} [DELETE]: Unable to update My Stuff, id null.`);
	}

	Logger.debug(`${id}, ${user?.id}`);

	const formData = await request.formData();
	const name = formData.get('name') as string;
	const photo = formData.get('photo') as File;
	const trustLevel = parseInt(formData.get('trust_level') as string);
	const description = formData.get('description') as string;
	const available = formData.get('available') as string;

	// if (!name || !photo || !trustRating) {
	if (!name || !trustLevel) {
		return requiredFieldsMissing(`${API_NAME} [PUT]: Unable to update My Stuff`);
	}

	const stuffEdit: StuffEdit = {
		name,
		trustLevel: trustLevel,
		available: available == 'true' ? true : false,
		description,
		updatedOn: new Date().toISOString()
	};

	Logger.debug(JSON.stringify(stuffEdit));
	Logger.debug(JSON.stringify(stuffToDb(stuffEdit as Stuff)));

	const { error } = await supabase
		.from('user_stuff')
		.update(stuffToDb(stuffEdit as Stuff))
		.eq('id', id);

	if (error) {
		return unknown();
	}

	return new Response(null, {
		status: 204
	});
};

export const DELETE: RequestHandler = async ({ params, locals: { supabase, safeGetSession } }) => {
	const { user } = await safeGetSession();
	if (!user) {
		return forbidden(`${API_NAME} [DELETE]: Unable to delete My Stuff, user null.`);
	}

	const id = params.id;

	if (!id) {
		return badRequest(`${API_NAME} [DELETE]: Unable to delete My Stuff w/id ${id}, user null.`);
	}

	Logger.debug(`${id}, ${user?.id}`);

	const response = await supabase
		.from('user_stuff')
		.delete()
		.eq('id', parseInt(id))
		.eq('user_id', user?.id);

	Logger.debug(`${response?.status}`);

	if (response?.status !== 204) {
		return unknown();
	}

	return new Response(null, {
		status: 204
	});
};
