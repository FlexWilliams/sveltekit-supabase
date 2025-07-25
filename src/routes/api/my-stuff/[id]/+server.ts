import { Logger } from '$lib/logging/logger';
import { badRequest, forbidden, unknown } from '$lib/web/http/error-response';
import type { RequestHandler } from '@sveltejs/kit';

const API_NAME = 'My Stuff [id] API';

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
