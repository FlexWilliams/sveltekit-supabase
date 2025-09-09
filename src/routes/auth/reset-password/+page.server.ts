import { Logger } from '$lib/logging/logger';
import { redirect } from '@sveltejs/kit';
import type { Actions } from './$types';

const loggerName = '[Profile Reset Password Form Actions]';

export const actions: Actions = {
	reset: async ({ request, fetch, locals: { safeGetSession } }) => {
		const { user } = await safeGetSession();
		if (!user) {
			return redirect(303, '/auth/login');
		}

		const formData = await request.formData();
		const password = formData.get('password') as string;
		const confirmPassword = formData.get('confirm-password') as string;

		if (!password || !confirmPassword || password !== confirmPassword) {
			return { error: 'invalid password combination', invalid: true };
		}

		Logger.debug(`${loggerName}: User ${user?.id} attempting to reset password...`);

		const response = await fetch(`/api/auth/reset-password`, {
			method: 'POST',
			body: JSON.stringify({ password, confirmPassword }),
			headers: {
				'Content-Type': 'application/json'
			}
		});

		if (!response.ok) {
			Logger.error(`${loggerName}: Error reseting password for user: ${user?.id}`);
			return { error: 'unknown' };
		}

		Logger.debug(`${loggerName}: User ${user?.id} successfully reset password!`);

		return { success: true };
	}
} satisfies Actions;
