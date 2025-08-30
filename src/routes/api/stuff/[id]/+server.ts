import { Logger } from '$lib/logging/logger';
import { stuffFromDb, type StuffFromDb } from '$lib/stuff/model/stuff';
import { badRequest, ok } from '$lib/web/http/error-response';
import { prettyJson } from '$lib/web/http/response';
import type { RequestHandler } from '@sveltejs/kit';

const API_NAME = 'Stuff [id] API';

export const GET: RequestHandler = async ({ params, locals: { supabase, safeGetSession } }) => {
	const { user } = await safeGetSession();
	if (!user) {
		Logger.debug(`${API_NAME} [GET]: Error, user null.`);

		return new Response(null, {
			status: 403
		});
	}

	const { id } = params;
	if (!id) {
		return badRequest(`${API_NAME} [GET] - Error, id null.`);
	}

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
		Logger.debug(`${API_NAME} [GET]: Error occurred: ${prettyJson(error)}`);

		return new Response(null, {
			status: 404
		});
	}

	let stuff = data as StuffFromDb[];

	return ok(stuffFromDb(stuff[0]));
};
