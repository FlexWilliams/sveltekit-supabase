import { Logger } from '$lib/logging/logger';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ depends, locals: { supabase } }) => {
	depends('supabase:db:notes');
	const { data: notes } = await supabase.from('notes').select('id,note').order('id');
	return { notes: notes ?? [] };
};

export const actions = {
	updateProfile: async ({ request }) => {
		const data = await request.formData();
		const userName = data.get('username') as string;
		const profilePic = data.get('profile-pic') as File;

		Logger.debug(`[Page][updateProfile] - updating user profile...`);

		Logger.debug(`${userName}`);
		Logger.debug(`${profilePic?.name}`);
		Logger.debug(`${profilePic?.size}`);

		Logger.debug(`[Page][updateProfile] - user profile updated successfully!`);

		return { success: true, profile: { userName } };
	}
} satisfies Actions;
