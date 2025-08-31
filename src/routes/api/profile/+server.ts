import { ApiLogger } from '$lib/logging/api-logger';
import type { UserMetaFromDb } from '$lib/user/model/user-meta';
import { badRequest, forbidden, unknown } from '$lib/web/http/error-response';
import type { RequestHandler } from '@sveltejs/kit';

const logger = new ApiLogger('Profile API');

const allowedImageFormats = ['image/jpeg', 'image/png'];

export const PUT: RequestHandler = async ({ request, locals: { supabase, safeGetSession } }) => {
	logger.setRequestType('PUT');

	const { user } = await safeGetSession();
	if (!user) {
		return forbidden('Error, user null');
	}

	const formData = await request.formData();
	const userName = formData.get('user_name') as string;
	const profilePic = formData.get('profile_pic') as File;

	if (profilePic && allowedImageFormats.indexOf(profilePic.type.toLowerCase()) === -1) {
		return badRequest('Error, image format not supported.');
	}

	if (!userName) {
		return badRequest('Error, username null');
	}

	const userMeta: Partial<UserMetaFromDb> = {
		user_name: userName,
		updated_on: new Date().toISOString()
	};

	logger.debug(`Attempting to update user profile for user w/id ${user?.id}...`);

	const userNameChangeResponse = await supabase
		.from('user_meta')
		.update(userMeta)
		.eq('id', user?.id);

	if (userNameChangeResponse.error) {
		logger.error(
			`Error updating the username for user id ${user?.id}: ${userNameChangeResponse?.error?.message}`
		);
		return unknown();
	} else {
		logger.debug(`Success updating username!`);
	}

	if (profilePic) {
		const fileName = `profile_pic.img`; // Using .img as extension to allow upserting diff file types to same file name

		const { data, error } = await supabase.storage
			.from(`user-meta`)
			.upload(`${user?.id}/${fileName}`, profilePic, { upsert: true });

		if (error) {
			logger.error(`Error uploading new profile pic: ${error?.message}`);
			return unknown();
		} else if (data) {
			logger.debug(`Success uploading new profile pic!`);
		}
	}

	logger.debug(`Successfully updated user profile for user w/id ${user?.id}!`);

	return new Response(null, {
		status: 204
	});
};
