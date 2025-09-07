import type { Chat } from '$lib/chat/model/chat';
import { Logger } from '$lib/logging/logger';
import { unknown } from '$lib/web/http/error-response';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({
	params,
	fetch,
	locals: { supabase, safeGetSession }
}) => {
	const id = params.id;

	let chats: Chat[] = [];
	const chatsResponse = await fetch(`/api/stuff/${id}/chats`);
	if (chatsResponse.ok) {
		chats = (await chatsResponse.json()) as Chat[];
	}

	return { chats };
};

export const actions = {
	sendChat: async ({ request, params, fetch, locals: { supabase, safeGetSession } }) => {
		const { id } = params;
		if (!id) {
			return { error: 'id missing' };
		}

		const data = await request.formData();
		const message = data.get('message') as string;
		const activeConversation = data.get('activeConversation') as string;

		if (!message) {
			// TODO: can also disallow words here (ex. curse words, etc.)
			return { error: 'message empty' };
		}

		Logger.debug(`Sending chat via form...`);

		const response = await fetch(`/api/stuff/${id}/chats`, {
			method: 'POST',
			body: JSON.stringify({ message, activeConversation }),
			headers: {
				'Content-Type': 'application/json'
			}
		});

		if (!response.ok) {
			Logger.error(`Error sending chat via form!`);
			return unknown();
		}

		Logger.debug(`Chat sent successfully, fetching latest messages...`);

		let chats: Chat[] = [];

		const chatsResponse = await fetch(`/api/stuff/${id}/chats`);
		if (chatsResponse.ok) {
			chats = (await chatsResponse.json()) as Chat[];
		}

		Logger.debug(`Fetched ${chats.length} messages!`);

		return { success: true, activeConversation, chats };
	},

	conversation: async ({ request, params, fetch, locals: { supabase, safeGetSession } }) => {
		const { id } = params;
		if (!id) {
			return { error: 'id missing' };
		}

		const data = await request.formData();
		const activeConversation = data.get('activeConversation') as string;

		if (!activeConversation) {
			return { error: 'activeConversation empty' };
		}

		Logger.debug(`Fetching chats via form...`);

		const response = await fetch(`/api/stuff/${id}/chats?activeConversation=${activeConversation}`);
		if (!response.ok) {
			Logger.error(`Error fetching chat via form!`);
			return unknown();
		}

		let chats: Chat[] = [];
		chats = (await response.json()) as Chat[];

		Logger.debug(`Fetched ${chats.length} messages!`);

		return { success: true, activeConversation, chats };
	}
} satisfies Actions;
