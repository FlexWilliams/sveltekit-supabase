import {
	chatsFromDbList,
	chatToDb,
	createNewChat,
	type Chat,
	type ChatFromDb
} from '$lib/chat/model/chat';
import { ApiLogger } from '$lib/logging/api-logger';
import { getSupabaseServerClient } from '$lib/server/supabase/supabase';
import type { Stuff } from '$lib/stuff/model/stuff';
import { badRequest, forbidden, notFound, ok, unknown } from '$lib/web/http/error-response';
import { prettyJson } from '$lib/web/http/response';
import type { RequestHandler } from '@sveltejs/kit';

const logger = new ApiLogger('Stuff [id] Chats API');

export const GET: RequestHandler = async ({
	params,
	url,
	fetch,
	locals: { supabase, safeGetSession }
}) => {
	logger.setRequestType('GET');

	const { user } = await safeGetSession();
	if (!user) {
		return forbidden(`Error, user null.`);
	}

	const { id } = params;
	if (!id) {
		return badRequest(`Error, id null.`);
	}

	let activeConversation: string | null = null;

	const stuffResponse = await fetch(`/api/stuff/${id}`);
	if (stuffResponse.ok) {
		const stuff = (await stuffResponse.json()) as Stuff;

		if (stuff?.userId === user?.id) {
			// If owner, allow `activeConversation` param
			activeConversation = url.searchParams.get('activeConversation');
		}
	}

	logger.debug(`Fetching chat messages for stuff w/id: ${id}...`);
	logger.debug(`\n\n\n\n${activeConversation}...`);

	const columns = `id,
                    created_on,
                    sender_id,
                    receiver_id,
                    stuff_id,
                    message`;

	const { data, error } = activeConversation
		? await supabase
				.from('user_chats')
				.select(columns)
				.eq('stuff_id', id)
				.or(`sender_id.eq.${activeConversation},receiver_id.eq.${activeConversation}`)
				.order('created_on')
		: await supabase.from('user_chats').select(columns).eq('stuff_id', id).order('created_on');

	if (error) {
		logger.error(`Error occurred: ${prettyJson(error)}`);
		return notFound();
	}

	logger.debug(`Successfully fetched ${data.length} chat messages stuff w/id: ${id}...`);

	let chats = chatsFromDbList(data as ChatFromDb[], user?.id);

	return ok(chats);
};

export const POST: RequestHandler = async ({
	request,
	fetch,
	params,
	locals: { supabase, safeGetSession }
}) => {
	logger.setRequestType('POST');

	const { user } = await safeGetSession();
	if (!user) {
		return forbidden(`Error, user null.`);
	}

	const { id } = params;
	if (!id) {
		return badRequest(`Error, id null.`);
	}

	const { message, activeConversation } = await request.json();

	if (!message) {
		return badRequest(`Error, message null.`);
	}

	const stuffResponse = await fetch(`/api/stuff/${id}`);
	if (!stuffResponse.ok) {
		logger.error(`Error fetching stuff`);
		return unknown();
	}
	const stuff = (await stuffResponse.json()) as Stuff;

	logger.debug(
		`Sending chat message for stuff w/id: ${id} between sender (${user?.id}) and receiver (${stuff.userId})`
	);

	const isRenter = stuff?.userId === user?.id;
	if (isRenter && !activeConversation) {
		return badRequest(`Error, activeConversation null.`);
	}

	const newChat = isRenter
		? createNewChat(user?.id, activeConversation, parseInt(id), message)
		: createNewChat(user?.id, stuff?.userId, parseInt(id), message);

	const supabaseElevated = getSupabaseServerClient();
	const existingChatGroupResponse = await supabaseElevated
		.from('stuff_chats')
		.upsert(
			{ stuff_id: parseInt(id), rentee_id: isRenter ? activeConversation : user?.id },
			{ ignoreDuplicates: true }
		)
		.select();

	if (existingChatGroupResponse.error) {
		return unknown(`Error creating chat group`);
	}

	const { data, error } = await supabase
		.from('user_chats')
		.insert(chatToDb(newChat as Chat))
		.select();

	if (error) {
		logger.error(`Error occurred: ${prettyJson(error)}`);
		return unknown();
	}

	logger.debug(
		`Successfully sent chat message for stuff w/id: ${id} between sender (${user?.id}) and receiver (${stuff.userId})`
	);

	let chat = chatsFromDbList(data as ChatFromDb[], user?.id)[0];

	return ok(chat);
};
