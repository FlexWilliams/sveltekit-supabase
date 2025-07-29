import { Logger } from '$lib/logging/logger';
import { badRequest, forbidden, unknown } from '$lib/web/http/error-response';
import type { RequestHandler } from '@sveltejs/kit';

const API_NAME = 'My Stuff [id] Photo Count API';

export const GET: RequestHandler = async ({ params, locals: { supabase, safeGetSession } }) => {
	const { user } = await safeGetSession();
	if (!user) {
		return forbidden(`${API_NAME} [GET] - Error: user null.`);
	}

	const id = params.id;

	if (!id) {
		return badRequest(`${API_NAME} [GET] - Error: id null.`);
	}

	const folderPath = `${user?.id}/${id}/images/`;
	const { data, error } = await supabase.storage.from('user-stuff').list(folderPath, {
		limit: 100,
		offset: 0
	});

	if (error) {
		return unknown();
	}

	Logger.debug(`${API_NAME} [GET]: Stuff with id: ${id} has ${data.length} photos.`);

	return new Response(
		JSON.stringify({
			count: data.length
		}),
		{
			status: 200
		}
	);
};
