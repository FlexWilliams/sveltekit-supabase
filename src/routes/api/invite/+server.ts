import { Logger } from '$lib/logging/logger';
import { getSupabaseServerClient } from '$lib/server/supabase/supabase';
import { badRequest, forbidden, noContent, unknown } from '$lib/web/http/error-response';
import { prettyJson } from '$lib/web/http/response';
import type { RequestHandler } from '@sveltejs/kit';

const API_NAME = 'Invite API';

export const POST: RequestHandler = async ({
	url,
	cookies,
	fetch,
	request,
	locals: { safeGetSession }
}) => {
	const { user } = await safeGetSession();
	if (!user) {
		return forbidden(`${API_NAME} [POST]: User null.`);
	}

	const { email } = await request.json();
	if (!email) {
		// TODO: email regex check here as well...
		return badRequest(`Invalid email!`);
	}

	Logger.debug(`${API_NAME} [POST]: Attempting to create new user for email: ${email}...`);

	const supabase = getSupabaseServerClient();

	if (!supabase) {
		return unknown();
	}

	const { data, error } = await supabase.auth.signUp({
		email,
		password: `temp_pw_${crypto.randomUUID().split('-')[0]}_${new Date().getTime()}`
	});

	if (error) {
		Logger.debug(`${API_NAME} API: Error, ${JSON.stringify(error)}`);
		return unknown(`Error sending invite, sign-up error.`);
	}

	Logger.debug(`${API_NAME} API: User obj:\n ${prettyJson(data.user)}`);

	// Add user to user-meta table
	const userMeta = await supabase.from(`user_meta`).insert({
		id: data?.user?.id,
		user_name: email
	});

	if (userMeta.error) {
		if (userMeta.error?.message.indexOf(`violates foreign key constraint`) !== -1) {
			Logger.debug(`${API_NAME} API: Error adding user to user_meta table, user exists already.`);
			return noContent(`User invite sent. Awaiting confirmation!`);
		} else {
			Logger.debug(
				`${API_NAME} API: Error adding user to user_meta table, ${JSON.stringify(userMeta.error)}`
			);
			return unknown(`Error sending invite, sign-up error.`);
		}
	}

	// Add users to friend table
	const user_id = user?.id;
	const friend_id = data?.user?.id;

	Logger.debug(`${user_id},${friend_id}`);

	const friend1 = await supabase.from(`friends`).insert({
		user_id: user?.id,
		friend_id: friend_id,
		user_invited_friend: true
	});

	const friend2 = await supabase.from(`friends`).insert({
		user_id: friend_id,
		friend_id: user?.id,
		user_invited_friend: false
	});

	if (friend1.error || friend2.error) {
		Logger.debug(
			`${API_NAME} API: Error adding users as friends, ${JSON.stringify(friend1.error)}\n${JSON.stringify(friend2.error)}`
		);
		return unknown(`Error sending invite, sign-up error.`);
	}

	Logger.debug(`Sent user invite: ${JSON.stringify(data)}`);

	return noContent(`User invite sent. Awaiting confirmation!`);
};
