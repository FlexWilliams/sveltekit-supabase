import { Logger } from '$lib/logging/logger';
import { badRequest, forbidden, noContent, unknown } from '$lib/web/http/error-response';
import { prettyJson } from '$lib/web/http/response';
import type { RequestHandler } from '@sveltejs/kit';

const API_NAME = 'Reset Password API';

export const POST: RequestHandler = async ({ request, locals: { supabase, safeGetSession } }) => {
	const { user } = await safeGetSession();
	if (!user) {
		return forbidden(`${API_NAME} [POST]: User null.`);
	}

	const { password, confirmPassword } = await request.json();
	if (!password || !confirmPassword || password !== confirmPassword) {
		return badRequest(`Invalid password set!`);
	}

	Logger.debug(`${API_NAME} [POST]: Attempting to reset user password for email: ${user?.id}...`);

	const { error } = await supabase.auth.updateUser({
		password
	});

	if (error) {
		Logger.error(`${API_NAME} [POST]: Error resetting password: ${prettyJson(error)}`);
		return unknown(`Unable to reset the User's password`);
	}

	let user_meta = await supabase.from(`user_meta`).select().eq('id', user?.id);

	if (user_meta.error) {
		Logger.error(
			`${API_NAME} [POST]: Unable to update user_meta object after password reset (not found). ${prettyJson(user_meta.error)}`
		);
	} else if (user_meta.data) {
		const resetPw = await supabase
			.from(`user_meta`)
			.update({ reset_password: true })
			.eq('id', user?.id);

		if (resetPw.error) {
			Logger.error(
				`${API_NAME} [POST]: Unable to update user_meta object after password reset. ${prettyJson(user_meta.error)}`
			);
		}
	}

	Logger.debug(`${API_NAME} [POST]: User password reset successfully!`);

	return noContent(`User password reset successfully!`);
};
