import type { EmailOtpType } from '@supabase/supabase-js';
import { redirect } from '@sveltejs/kit';

import { Logger } from '$lib/logging/logger';
import { userMetaFromDb } from '$lib/user/model/user-meta';
import { prettyJson } from '$lib/web/http/response';
import type { RequestHandler } from './$types';

const API_NAME = 'EMAIL CONFIRMATION API';

export const GET: RequestHandler = async ({ url, locals: { supabase } }) => {
	const token_hash = url.searchParams.get('token_hash');
	const type = url.searchParams.get('type') as EmailOtpType | null;
	const next = url.searchParams.get('next') ?? '/';

	/**
	 * Clean up the redirect URL by deleting the Auth flow parameters.
	 *
	 * `next` is preserved for now, because it's needed in the error case.
	 */
	const redirectTo = new URL(url);
	redirectTo.pathname = next;
	redirectTo.searchParams.delete('token_hash');
	redirectTo.searchParams.delete('type');

	if (token_hash && type) {
		const { data, error } = await supabase.auth.verifyOtp({ type, token_hash });
		if (!error) {
			let user_meta = await supabase.from(`user_meta`).select().eq('id', data?.user?.id);
			if (user_meta.error) {
				Logger.error(`User_meta object not found after verifying email!`);
				redirectTo.pathname = '/auth/error';
				return redirect(303, redirectTo);
			} else {
				let meta = user_meta.data[0];
				user_meta = await supabase
					.from(`user_meta`)
					.update({ ...meta, email_confirmed: true })
					.eq('id', data?.user?.id)
					.select();

				if (user_meta.error) {
					Logger.error(
						`${API_NAME}: Error updating user meta email confirmed flag: ${prettyJson(error)}`
					);
				}

				meta = user_meta.data;
				const userMeta = userMetaFromDb(meta[0]);
				if (!userMeta.resetPassword) {
					redirectTo.pathname = '/auth/reset-password';
					return redirect(303, redirectTo);
				} else {
					redirectTo.searchParams.delete('next');
					return redirect(303, redirectTo);
				}
			}
		}

		Logger.error(JSON.stringify(error));

		if (error?.status === 403 && error?.code === 'otp_expired') {
			Logger.debug(`${API_NAME}: OTP expired. User was sent another.`);
			redirectTo.searchParams.delete('next');
			return redirect(303, `/auth/otp-error`);
		}
	}

	redirectTo.pathname = '/auth/error';
	return redirect(303, redirectTo);
};
