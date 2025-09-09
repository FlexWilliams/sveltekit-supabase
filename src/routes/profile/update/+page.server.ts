import { Logger } from '$lib/logging/logger';
import { userMetaFromDbList } from '$lib/user/model/user-meta';
import { prettyJson } from '$lib/web/http/response';
import { redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ depends, locals: { supabase, safeGetSession } }) => {
	depends('supabase:db:user-meta');

	const { user } = await safeGetSession();

	const { data: userMeta } = await supabase
		.from('user_meta')
		.select('id,user_name,profile_pic_url')
		.eq('id', user?.id);

	const meta = userMetaFromDbList(userMeta)[0];

	Logger.debug(`UserMeta: ${JSON.stringify(meta)}`);

	return { userMeta: meta };
};

const loggerName = '[Profile Update Form Actions]';

export const actions = {
	profile: async ({ request, locals: { supabase, safeGetSession } }) => {
		const { user } = await safeGetSession();
		if (!user) {
			redirect(303, '/auth/login');
		}

		const formData = await request.formData();
		const userName = formData.get('username') as string;
		const profilePic = formData.get('profile-pic') as File;

		if (!userName) {
			return {
				success: false,
				error: 'Username null!'
			};
		}

		Logger.debug(`[Page][updateProfile] - updating user profile...`);
		Logger.debug(`${loggerName}: Attempting to update the user profile...`);

		const userNameChangeResponse = await supabase
			.from('user_meta')
			.update({
				user_name: userName
			})
			.eq('id', user?.id);

		if (userNameChangeResponse.error) {
			const errorMessage = prettyJson(userNameChangeResponse?.error);
			const msg = `${loggerName}: Error updating the username for user id ${user?.id}: ${errorMessage}`;
			Logger.error(msg);
		} else {
			Logger.debug(`${loggerName}: Success updating username to ${userName}!`);
		}

		let profilePicData: ArrayBuffer = new ArrayBuffer(0);
		if (profilePic) {
			const { data, error } = await supabase.storage
				.from(`user-meta`) // TODO: set correct mime type, don't hardcode jpg
				.upload(`${user?.id}/profile_pic.jpg`, profilePic, { upsert: true });

			if (error) {
				Logger.error(
					`${loggerName}: Error uploading new profile pic: ${prettyJson(error?.message)}`
				);
			} else if (data) {
				Logger.debug(`${loggerName}: Success uploading new profile pic!`);
				profilePicData = await profilePic.arrayBuffer();
			}
		}

		return { success: true, profile: { userName, profilePic: profilePicData } };
	}
} satisfies Actions;
