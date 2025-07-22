import { Logger } from '$lib/logging/logger';
import { fromDbList } from '$lib/user/model/user-meta';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ depends, locals: { supabase, safeGetSession } }) => {
	depends('supabase:db:user-meta');

	const { user } = await safeGetSession();

	const { data: userMeta } = await supabase
		.from('user_meta')
		.select('id,user_name,profile_pic_url')
		.eq('id', user?.id);

	const meta = fromDbList(userMeta)[0];

	Logger.debug(`UserMeta: ${JSON.stringify(meta)}`);

	return { userMeta: meta };
};

export const actions = {
	updateProfile: async ({ request, locals: { supabase, safeGetSession } }) => {
		const { user } = await safeGetSession();

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
		Logger.debug(`${userName}`);
		Logger.debug(`${profilePic?.name}`);
		Logger.debug(`${profilePic?.size}`);

		const userNameChangeResponse = await supabase
			.from('user_meta')
			.update({
				user_name: userName
			})
			.eq('id', user?.id);

		if (userNameChangeResponse.error) {
			Logger.error(
				`Error updating the username for user id ${user?.id}: ${userNameChangeResponse?.error?.message}`
			);
		} else {
			Logger.debug(`Success updating username!`);
		}

		let profilePicData: ArrayBuffer = new ArrayBuffer(0);
		if (profilePic) {
			const { data, error } = await supabase.storage
				.from(`user-meta`)
				.upload(`${user?.id}/profile_pic.jpg`, profilePic, { upsert: true }); // TODO: set correct mime type, don't hardcode jpg

			if (error) {
				Logger.error(`Error uploading new profile pic: ${error?.message}`);
			} else if (data) {
				Logger.debug(`Success uploading new profile pic!`);
				profilePicData = await profilePic.arrayBuffer();
			}
		}

		return { success: true, profile: { userName, profilePic: profilePicData } };
	}
} satisfies Actions;
