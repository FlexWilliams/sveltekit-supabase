import { stuffFromDb } from '$lib/stuff/model/stuff';
import { forbidden, notFound, ok, unknown } from '$lib/web/http/error-response';
import type { RequestHandler } from '@sveltejs/kit';

const API_NAME = 'Friend Stuff [id] API';

export const GET: RequestHandler = async ({ params, locals: { supabase, safeGetSession } }) => {
	const { user } = await safeGetSession();
	if (!user) {
		return forbidden(`${API_NAME} [GET]: Unable to get Friend Stuff, user null.`);
	}

	const { id } = params;
	if (!id) {
		return notFound(`Id null`);
	}

	const { data, error } = await supabase
		.from('user_stuff')
		.select(
			`
			id,
			user_id,
			name,
			description,
			available,
			image_url,
			user_meta (
				user_name
			)
				`
		)
		.eq('id', id);

	if (error) {
		return unknown();
	}

	if (!data || data.length === 0) {
		return notFound(`Stuff with id ${id} not found.`);
	}

	return ok(stuffFromDb(data[0]));
};
