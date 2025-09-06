import { Logger } from '$lib/logging/logger';
import { unknown } from '$lib/web/http/error-response';
import { prettyJson } from '$lib/web/http/response';
import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals: { supabase } }) => {
	const { error } = await supabase.auth.signOut();
	if (error) {
		Logger.error(`Error signing out the user:\n${prettyJson(error)}`);
		return unknown();
	}

	Logger.debug(`User successfully signed out, redirecting to home page...`);

	redirect(303, '/auth/login');
};
