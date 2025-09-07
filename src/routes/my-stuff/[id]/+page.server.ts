import { Logger } from '$lib/logging/logger';
import { stuffFromDbList, type Stuff, type StuffFromDb } from '$lib/stuff/model/stuff';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { PageServerLoad } from './$types';

const fetchItem = async (
	itemId: string,
	userId: string,
	supabase: SupabaseClient
): Promise<Stuff[]> => {
	let stuff: Stuff[] = [];

	const columns = 'id,user_id,created_on,name,trust_level,description,available,image_url';

	const { data, error } = await supabase
		.from('user_stuff')
		.select(columns)
		.eq('id', itemId)
		.eq('user_id', userId)
		.order('created_on');

	if (error) {
		Logger.debug(error?.message ? error?.message : 'Error fetching user inventory items!');
	} else {
		stuff = stuffFromDbList(data as StuffFromDb[], userId);
		Logger.debug(`Fetched ${stuff?.length} items.`);
	}

	return stuff;
};

export const load: PageServerLoad = async ({ params, locals: { supabase, safeGetSession } }) => {
	const { user } = await safeGetSession();
	const itemId = params.id;

	const stuff = await fetchItem(itemId, user?.id, supabase);

	return { stuff };
};
