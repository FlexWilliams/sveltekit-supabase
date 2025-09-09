import { Logger } from '$lib/logging/logger';
import { redirect } from '@sveltejs/kit';
import type { Actions } from './$types';

const loggerName = '[Profile Invite Form Actions]';

export const actions: Actions = {
	invite: async ({ request, fetch, locals: { safeGetSession } }) => {
		const { user } = await safeGetSession();
		if (!user) {
			return redirect(303, '/auth/login');
		}

		const formData = await request.formData();
		const email = formData.get('email') as string;

		if (!email) {
			return { error: 'email empty' };
		}

		Logger.debug(`${loggerName}: User ${user?.id} attempting to send invite to: ${email}`);

		const response = await fetch(`/api/invite`, {
			method: 'POST',
			body: JSON.stringify({
				email
			}),
			headers: {
				'Content-Type': 'application/json'
			}
		});

		if (!response.ok) {
			Logger.error(`${loggerName}: Error sending invite to email: ${email}`);
			return { error: 'unknown', email };
		}

		Logger.debug(`${loggerName}: User ${user?.id} uccessfully sent invite to: ${email}`);

		return { success: true, email };
	}
} satisfies Actions;
