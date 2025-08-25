import { Logger } from '$lib/logging/logger';
import { userMetaFromDbList, type UserMetaFromDb } from '$lib/user/model/user-meta';
import { badRequest, ok, unknown } from '$lib/web/http/error-response';
import { prettyJson } from '$lib/web/http/response';
import { type RequestHandler } from '@sveltejs/kit';

const API_NAME = 'Magic Link API';

export const POST: RequestHandler = async ({ request, locals: { supabase } }) => {
	const { accessToken, refreshToken } = await request.json();
	if (!accessToken || !refreshToken) {
		return badRequest(`Invalid tokens!`);
	}

	Logger.debug(`${API_NAME} [POST]: Attempting to set session for user w/token: ${accessToken}...`);

	const {
		data: { user },
		error
	} = await supabase.auth.setSession({
		access_token: accessToken,
		refresh_token: refreshToken
	});

	if (error) {
		Logger.error(`${API_NAME} [POST]: Error setting session: ${prettyJson(error)}`);
		return unknown(`Error logging in via-magic link`);
	}

	Logger.debug(`${API_NAME} [POST]: User logged in successfully!`);

	let userMeta = null;

	if (user?.id) {
		const { data: userMetaFromDb } = await supabase
			.from('user_meta')
			.select('id,user_name,profile_pic_url')
			.eq('id', user?.id);

		userMeta = userMetaFromDbList(userMetaFromDb as UserMetaFromDb[])[0];
	}

	return ok({ user, userMeta });
};
