import { ApiLogger } from '$lib/logging/api-logger';
import { badRequest, noContent, ok, unknown } from '$lib/web/http/error-response';
import { prettyJson } from '$lib/web/http/response';
import { type RequestHandler } from '@sveltejs/kit';

const logger = new ApiLogger('Magic Link API');

export const POST: RequestHandler = async ({ request, locals: { safeGetSession, supabase } }) => {
	logger.setRequestType('POST');

	let loggedInUser = (await safeGetSession()).user;
	if (loggedInUser) {
		return noContent(`User already logged in.`);
	}

	const { email } = await request.json();
	if (!email) {
		return badRequest(`Error, invalid email.`);
	}

	logger.debug(`Attempting to send magic link for email: ${email}...`);

	const { error } = await supabase.auth.signInWithOtp({
		email,
		options: {
			shouldCreateUser: false
		}
	});

	if (error) {
		logger.error(`Error sending magic link: ${prettyJson(error)}`);
		return unknown(`Error sending magic link`);
	}

	logger.debug(`Magic Link sent!`);

	return ok();
};
