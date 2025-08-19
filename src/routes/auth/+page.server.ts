import { redirect } from '@sveltejs/kit';

import { Logger } from '$lib/logging/logger';
import { prettyJson } from '$lib/web/http/response';
import type { Actions } from './$types';

export const actions: Actions = {
	signup: async ({ request, locals: { supabase } }) => {
		const formData = await request.formData();
		const email = formData.get('email') as string;
		const password = formData.get('password') as string;

		const { error } = await supabase.auth.signUp({ email, password });
		if (error) {
			Logger.error(error);
			redirect(303, '/auth/error');
		} else {
			redirect(303, '/');
		}
	},
	login: async ({ request, locals: { supabase } }) => {
		const formData = await request.formData();
		const email = formData.get('email') as string;
		const password = formData.get('password') as string;

		const { data, error } = await supabase.auth.signInWithPassword({ email, password });
		if (error) {
			Logger.error(`Login Action: Error,\n ${prettyJson(error)}`);

			if (error?.code === 'email_not_confirmed') {
				redirect(303, '/auth/confirm-email');
			}

			return { error: error.message }; // TODO: suppress messages/wrap them
		} else {
			if (data) {
				Logger.debug('LOGIN ACTION' + prettyJson(data));
			}
			Logger.debug(prettyJson(data));
			redirect(303, '/');
		}
	}
};
