import { ApiLogger } from '$lib/logging/api-logger';
import { badRequest, forbidden, noContent, unknown } from '$lib/web/http/error-response';
import { prettyJson } from '$lib/web/http/response';
import type { RequestHandler } from '@sveltejs/kit';

const logger = new ApiLogger(`Reset Password API`);

export const POST: RequestHandler = async ({ request, locals: { supabase, safeGetSession } }) => {
	logger.setRequestType('POST');

	const { user } = await safeGetSession();
	if (!user) {
		return forbidden(`Error, User null.`);
	}

	const { password, confirmPassword } = await request.json();
	if (!password || !confirmPassword || password !== confirmPassword) {
		return badRequest(`Error, invalid password set.`);
	}

	logger.debug(`Attempting to reset user password for email: ${user?.id}...`);

	const { error } = await supabase.auth.updateUser({
		password
	});

	if (error) {
		logger.error(`Error resetting password: ${prettyJson(error)}`);
		return unknown(`Unable to reset the User's password`);
	}

	let user_meta = await supabase.from(`user_meta`).select().eq('id', user?.id);

	if (user_meta.error) {
		logger.error(
			`Unable to update user_meta object after password reset (not found). ${prettyJson(user_meta.error)}`
		);
	} else if (user_meta.data) {
		const resetPw = await supabase
			.from(`user_meta`)
			.update({ reset_password: true })
			.eq('id', user?.id);

		if (resetPw.error) {
			logger.error(
				`Unable to update user_meta object after password reset. ${prettyJson(user_meta.error)}`
			);
		}
	}

	logger.debug(`User password reset successfully!`);

	return noContent(`User password reset successfully!`);
};
