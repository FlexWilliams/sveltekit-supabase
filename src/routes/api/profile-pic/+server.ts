import { Logger } from '$lib/logging/logger';
import type { RequestHandler } from '@sveltejs/kit';

const API_NAME = 'Profile Pic API';

export const GET: RequestHandler = async ({ request, locals: { supabase, safeGetSession } }) => {
	const { user } = await safeGetSession();
	if (!user) {
		Logger.debug(`${API_NAME} [GET]: unable to get the user profile pic, user null.`);

		return new Response(null, {
			status: 403
		});
	}

	const {
		data: { signedUrl },
		error
	} = await supabase.storage.from('user-meta').createSignedUrl(`${user?.id}/profile_pic.img`, 60);

	if (error) {
		Logger.debug(`${API_NAME} [GET]: unable to get the user profile pic, not found.`);

		return new Response(null, {
			status: 404
		});
	}

	return new Response(signedUrl, {
		status: 200
	});
};
