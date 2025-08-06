import { stuffFromDbList } from '$lib/stuff/model/stuff';
import { forbidden, ok, unknown } from '$lib/web/http/error-response';
import type { RequestHandler } from '@sveltejs/kit';

const API_NAME = 'Friend Stuff API';

export const GET: RequestHandler = async ({ url, locals: { supabase, safeGetSession } }) => {
	const { user } = await safeGetSession();
	if (!user) {
		return forbidden(`${API_NAME} [GET]: Unable to get Friend Stuff, user null.`);
	}

	const searchText = url.searchParams.get('q');
	if (!searchText) {
		return ok([], `Search text empty. Returning empty array`);
	}

	const { data, error } = await supabase
		.from('user_stuff')
		.select()
		.or(`name.ilike.%${searchText}%,description.ilike.%${searchText}%`);

	if (error) {
		return unknown();
	}

	const logMessage = `${API_NAME}: Successfully found ${data?.length} items for query: ${searchText}`;
	return ok(stuffFromDbList(data), logMessage);
};
