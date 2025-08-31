import { ApiLogger } from '$lib/logging/api-logger';
import { forbidden, notFound } from '$lib/web/http/error-response';
import { prettyJson } from '$lib/web/http/response';
import type { RequestHandler } from '@sveltejs/kit';

const logger = new ApiLogger('Profile Pic API');

export const GET: RequestHandler = async ({ locals: { supabase, safeGetSession } }) => {
	logger.setRequestType('GET');

	const { user } = await safeGetSession();
	if (!user) {
		return forbidden('Error, user null');
	}

	logger.debug(`Attempting to get the profile pic for user w/id: ${user?.id}...`);

	const {
		data: { signedUrl },
		error
	} = await supabase.storage.from('user-meta').createSignedUrl(`${user?.id}/profile_pic.img`, 60);

	if (error) {
		logger.error(`Unable to get the user profile pic, not found.\n${prettyJson(error)}`);
		return notFound();
	}

	logger.debug(`Successfully fetched profile pic for user w/id: ${user?.id}...`);

	return new Response(signedUrl, {
		status: 200
	});
};
