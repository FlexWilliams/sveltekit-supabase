import { ApiLogger } from '$lib/logging/api-logger';
import { stuffFromDbList } from '$lib/stuff/model/stuff';
import { forbidden, ok, unknown } from '$lib/web/http/error-response';
import { prettyJson } from '$lib/web/http/response';
import type { RequestHandler } from '@sveltejs/kit';

const logger = new ApiLogger(`Friend Stuff API`);

export const GET: RequestHandler = async ({ url, locals: { supabase, safeGetSession } }) => {
	logger.setRequestType('GET');

	const { user } = await safeGetSession();
	if (!user) {
		return forbidden(`Error, user null.`);
	}

	const searchText = url.searchParams.get('q');
	if (!searchText) {
		return ok([], `Search text empty. Returning empty array`);
	}

	const { data: friends, error: e } = await supabase
		.from('friends')
		.select('friend_id')
		.or(`user_id.eq.${user?.id}`);

	const friendIds = (friends as any[]).map((f) => f.friend_id) as string[];

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
		.in('user_id', friendIds)
		.or(`name.ilike.%${searchText}%,description.ilike.%${searchText}%`);

	if (error) {
		logger.error(`Error occured: ${prettyJson(error)}`);
		return unknown();
	}

	logger.debug(`Successfully found ${data?.length} items for query: ${searchText}`);

	return ok(stuffFromDbList(data, user?.id));
};
