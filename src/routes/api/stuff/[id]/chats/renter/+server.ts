import { chatGroupFromDbList, type ChatGroupFromDb } from '$lib/chat/model/chat';
import { ApiLogger } from '$lib/logging/api-logger';
import { badRequest, forbidden, notFound, ok } from '$lib/web/http/error-response';
import { prettyJson } from '$lib/web/http/response';
import type { RequestHandler } from '@sveltejs/kit';

const logger = new ApiLogger('Stuff [id] Owner Chat Groups API');

export const GET: RequestHandler = async ({ params, locals: { supabase, safeGetSession } }) => {
	logger.setRequestType('GET');

	const { user } = await safeGetSession();
	if (!user) {
		return forbidden(`Error, user null.`);
	}

	const { id } = params;
	if (!id) {
		return badRequest(`Error, id null.`);
	}

	logger.debug(`Fetching chat groups for stuff w/id: ${id}...`);

	// TODO: restrict access to owner of stuff!! i.e., rls policy!
	const { data, error } = await supabase.from('stuff_chats').select().eq('stuff_id', parseInt(id));

	if (error) {
		logger.error(`Error occurred: ${prettyJson(error)}`);
		return notFound();
	}

	const chatGroups = chatGroupFromDbList(data as ChatGroupFromDb[]);

	logger.debug(`Successfully fetched ${chatGroups.length} chat messages stuff w/id: ${id}...`);

	return ok(chatGroups);
};
