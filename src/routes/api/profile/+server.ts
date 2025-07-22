import { Logger } from '$lib/logging/logger';
import type { RequestHandler } from '@sveltejs/kit';

const API_NAME = 'Profile API';

const allowedImageFormats = ['image/jpeg', 'image/png'];

export const PUT: RequestHandler = async ({ request, locals: { supabase, safeGetSession } }) => {
	const { user } = await safeGetSession();
	if (!user) {
		Logger.debug(`${API_NAME} [PUT]: unable to update the user profile, user null.`);

		return new Response(null, {
			status: 403
		});
	}

	const formData = await request.formData();
	const userName = formData.get('user_name') as string;
	const profilePic = formData.get('profile_pic') as File;

	if (profilePic && allowedImageFormats.indexOf(profilePic.type.toLowerCase()) === -1) {
		return new Response(
			JSON.stringify({
				error: 'Image format not supported!'
			}),
			{
				status: 400,
				statusText: 'Image format not supported!'
			}
		);
	}

	if (!userName) {
		Logger.debug(`${API_NAME} [PUT]: unable to update the user profile, user name not passed in.`);

		return new Response(null, {
			status: 400,
			statusText: 'Username is null.'
		});
	} else {
		const userNameChangeResponse = await supabase
			.from('user_meta')
			.update({
				user_name: userName
			})
			.eq('id', user?.id);

		if (userNameChangeResponse.error) {
			Logger.error(
				`${API_NAME} [PUT]: Error updating the username for user id ${user?.id}: ${userNameChangeResponse?.error?.message}`
			);
		} else {
			Logger.debug(`${API_NAME} [PUT]: Success updating username!`);
		}
	}

	if (profilePic) {
		const fileName = `profile_pic.img`; // Using .img as extension to allow upserting diff file types to same file name

		const { data, error } = await supabase.storage
			.from(`user-meta`)
			.upload(`${user?.id}/${fileName}`, profilePic, { upsert: true });

		if (error) {
			Logger.error(`${API_NAME} [PUT]: Error uploading new profile pic: ${error?.message}`);
		} else if (data) {
			Logger.debug(`${API_NAME} [PUT]: Success uploading new profile pic!`);
		}
	}

	Logger.debug(`${API_NAME} [PUT]: Successfully updated user profile.`);

	return new Response(null, {
		status: 204
	});
};
