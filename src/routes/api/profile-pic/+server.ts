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

	const { data, error } = await supabase.storage
		.from(`user-meta`)
		.download(`${user?.id}/profile_pic.img`);

	if (error) {
		Logger.debug(`${API_NAME} [GET]: unable to get the user profile pic, not found.`);

		return new Response(null, {
			status: 404
		});
	}

	const profilePic = await (data as Blob).arrayBuffer();
	return new Response(profilePic, {
		status: 200
	});
};
