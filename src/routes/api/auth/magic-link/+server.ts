import { Logger } from '$lib/logging/logger';
import { badRequest, noContent, ok, unknown } from '$lib/web/http/error-response';
import { prettyJson } from '$lib/web/http/response';
import { type RequestHandler } from '@sveltejs/kit';

const API_NAME = 'Magic Link API';

export const POST: RequestHandler = async ({ request, locals: { safeGetSession, supabase } }) => {
	let loggedInUser = (await safeGetSession()).user;
	if (loggedInUser) {
		return noContent(`User already logged in.`);
	}

	const { email } = await request.json();
	if (!email) {
		return badRequest(`Invalid email!`);
	}

	Logger.debug(`${API_NAME} [POST]: Attempting to send magic link for email: ${email}...`);

	const { error } = await supabase.auth.signInWithOtp({
		email,
		options: {
			shouldCreateUser: false
		}
	});

	if (error) {
		Logger.error(`${API_NAME} [POST]: Error sending magic link: ${prettyJson(error)}`);
		return unknown(`Error sending magic link`);
	}

	Logger.debug(`${API_NAME} [POST]: Magic Link sent!`);

	return ok();
};
