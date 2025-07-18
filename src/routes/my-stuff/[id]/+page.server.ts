import { Logger } from '$lib/logging/logger';
import { fromDbList, type Stuff, type StuffFromDb } from '$lib/stuff/components/model/stuff';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { PageServerLoad } from './$types';

const fetchItem = async (
	itemId: string,
	userId: string,
	supabase: SupabaseClient
): Promise<Stuff[]> => {
	let stuff: Stuff[] = [];

	const columns = 'id,user_id,created_on,name,trust_rating,description,available';

	const { data, error } = await supabase
		.from('user_inventory')
		.select(columns)
		.eq('id', itemId)
		.eq('user_id', userId)
		.order('created_on');

	if (error) {
		Logger.debug(error?.message ? error?.message : 'Error fetching user inventory items!');
	} else {
		stuff = fromDbList(data as StuffFromDb[]);
		Logger.debug(`Fetched ${stuff?.length} items.`);
	}

	return stuff;
};

export const load: PageServerLoad = async ({
	depends,
	params,
	locals: { supabase, safeGetSession }
}) => {
	// depends('supabase:db:stuff');
	const { user } = await safeGetSession();
	const itemId = params.id;

	const stuff = await fetchItem(itemId, user?.id, supabase);

	return { stuff };
};
