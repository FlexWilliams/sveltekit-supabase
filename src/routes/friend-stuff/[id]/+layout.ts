import { PUBLIC_SUPABASE_ANON_KEY, PUBLIC_SUPABASE_URL } from '$env/static/public';
import type { ChatGroup } from '$lib/chat/model/chat';
import { Logger } from '$lib/logging/logger';
import type { MyRental } from '$lib/rental/model/rental';
import type { Stuff } from '$lib/stuff/model/stuff';
import { createBrowserClient, createServerClient, isBrowser } from '@supabase/ssr';
import type { LayoutLoad } from './$types';

const loader = `[Friend Stuff Layout Load]`;

export const load: LayoutLoad = async ({ data, fetch, params, depends }) => {
	const supabase = isBrowser()
		? createBrowserClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
				global: {
					fetch
				}
			})
		: createServerClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
				global: {
					fetch
				},
				cookies: {
					getAll() {
						return data.cookies;
					}
				}
			});

	const {
		data: { session }
	} = await supabase.auth.getSession();

	const {
		data: { user }
	} = await supabase.auth.getUser();

	const { id } = params;

	Logger.debug(`${loader}: Fetching stuff, rental, and chats for stuff w/id: ${id}`);

	let stuff: Stuff | null = null;
	let rental: MyRental | null = null;
	let chatGroups: ChatGroup[] | null = null;

	const stuffResponse = await fetch(`/api/friend-stuff/${id}`);
	if (stuffResponse.ok) {
		stuff = (await stuffResponse.json()) as Stuff;
	}

	if (stuff?.rentalId) {
		const rentalResponse = await fetch(`/api/rentals/${stuff?.rentalId}`);
		if (rentalResponse.ok) {
			rental = (await rentalResponse.json()) as MyRental;
		}
	}

	if (stuff?.userId === user?.id) {
		const chatGroupResponse = await fetch(`/api/stuff/${id}/chats/renter`);
		if (chatGroupResponse.ok) {
			chatGroups = (await chatGroupResponse.json()) as ChatGroup[];
		}
	}

	depends('friend:stuff');

	return { stuff, rental, chatGroups };
};
