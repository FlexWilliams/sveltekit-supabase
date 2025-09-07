import type { Stuff } from '$lib/stuff/model/stuff';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url, fetch }) => {
	const searchText = url.searchParams.get('searchText') || '*';

	let stuff: Stuff[] = [];
	const response = await fetch(`/api/friend-stuff?q=${encodeURI(searchText)}`);
	if (response.ok) {
		stuff = (await response.json()) as Stuff[];
	}

	return { stuff };
};
