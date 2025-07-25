import { Logger } from '$lib/logging/logger';
import { stuffFromDbList, type Stuff, type StuffFromDb } from '$lib/stuff/model/stuff';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { Actions, PageServerLoad } from './$types';

const fetchItems = async (
	userId: string,
	supabase: SupabaseClient,
	searchText?: string
): Promise<Stuff[]> => {
	let stuff: Stuff[] = [];

	const columns = 'id,user_id,created_on,name,trust_level,description,available';

	const { data, error } = await supabase
		.from('user_stuff')
		.select(columns)
		.eq('user_id', userId)
		.order('created_on');

	if (error) {
		Logger.debug(error?.message ? error?.message : 'Error fetching user inventory items!');
	} else {
		stuff = stuffFromDbList(data as StuffFromDb[]);
		Logger.debug(`Fetched ${stuff?.length} items.`);
	}

	return stuff;
};

export const load: PageServerLoad = async ({ depends, locals: { supabase, safeGetSession } }) => {
	const { user } = await safeGetSession();

	const stuff = await fetchItems(user?.id, supabase);

	return { stuff };
};

export const actions = {
	filterItems: async ({ request, locals: { supabase, safeGetSession } }) => {
		const data = await request.formData();
		const searchText = data.get('search-text') as string;

		Logger.debug(`[Page][filterItems] - Filtering Stuff by search text: ${searchText}...`);

		const { user } = await safeGetSession();
		let stuff = await fetchItems(user?.id, supabase, searchText);
		stuff = stuff.filter((s) => s.name.toLocaleLowerCase().indexOf(searchText?.toLowerCase()) > -1);

		Logger.debug(`[Page][filterItems] - Found ${stuff.length} matching items!`);

		return { success: true, searchText, items: stuff };
	}
} satisfies Actions;
