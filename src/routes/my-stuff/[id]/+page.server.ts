import { Logger } from '$lib/logging/logger';
import {
	stuffFromDbList,
	stuffToDb,
	type NewStuff,
	type Stuff,
	type StuffEdit,
	type StuffFromDb
} from '$lib/stuff/model/stuff';
import { prettyJson, type PhotoNamesResponse } from '$lib/web/http/response';
import type { SupabaseClient } from '@supabase/supabase-js';
import { redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

const fetchItem = async (
	itemId: string,
	userId: string,
	supabase: SupabaseClient
): Promise<Stuff | null> => {
	let stuff: Stuff | null = null;

	const columns = 'id,user_id,created_on,name,trust_level,description,available,image_url';

	const { data, error } = await supabase
		.from('user_stuff')
		.select(columns)
		.eq('id', itemId)
		.eq('user_id', userId)
		.order('created_on');

	if (error) {
		Logger.debug(error?.message ? error?.message : 'Error fetching user inventory items!');
	} else {
		stuff = stuffFromDbList(data as StuffFromDb[], userId)[0];
	}

	return stuff;
};

export const load: PageServerLoad = async ({
	params,
	fetch,
	locals: { supabase, safeGetSession }
}) => {
	const { user } = await safeGetSession();
	const itemId = params.id;

	const stuff = await fetchItem(itemId, user?.id, supabase);

	let photos: string[] | null = null;
	if (stuff) {
		const response = await fetch(`/api/stuff/${stuff?.id}/photo-names`);
		if (response.ok) {
			photos = ((await response.json()) as PhotoNamesResponse)?.photoNames;
		}
	}

	return { stuff, photos };
};

const loggerName = '[My Stuff (id) Form Actions]';

export const actions: Actions = {
	// TODO: merge with code copied from `src\routes\api\my-stuff\+server.ts`
	update: async ({ request, fetch, locals: { safeGetSession, supabase } }) => {
		const { user } = await safeGetSession();
		if (!user) {
			redirect(303, '/auth/login');
		}

		const formData = await request.formData();
		const stuffId = formData.get('stuff-id') as string;
		const name = formData.get('name') as string;
		const photosCount = parseInt(formData.get('photo_count') as string);
		const newPhotosCount = parseInt(formData.get('new_photo_count') as string);
		const trustLevel = parseInt(formData.get('trust_level') as string);
		const description = formData.get('description') as string;
		const available = formData.get('available') as string;

		if (!name || !trustLevel || (photosCount <= 0 && newPhotosCount <= 0)) {
			return { error: 'required fields missing', invalid: true };
		}

		if (stuffId) {
			// TODO: refactor copied code from `src\routes\api\my-stuff\[id]\+server.ts`
			Logger.debug(`${loggerName}: Attempting to update stuff item w/id ${stuffId}...`);

			const stuffEdit: StuffEdit = {
				userId: user?.id,
				name,
				trustLevel: trustLevel,
				available: available == 'true' ? true : false,
				description,
				updatedOn: new Date().toISOString()
			};

			const { error } = await supabase
				.from('user_stuff')
				.update(stuffToDb(stuffEdit as Stuff))
				.eq('id', stuffId);

			if (error) {
				return { error: 'unknown' };
			}

			const uploadPhotos = await fetch(`/api/stuff/${stuffId}/photos`, {
				method: 'POST',
				body: formData
			});

			if (!uploadPhotos.ok) {
				Logger.error(`${loggerName}: Error uploading photos for new stuff`);
				return { success: true, photos: false };
			}

			return { success: true };
		} else {
			// TODO: merge with code copied from `src\routes\api\my-stuff\+server.ts`
			const newStuff: NewStuff = {
				userId: user?.id,
				name,
				trustLevel: trustLevel,
				available: available == 'true' ? true : false,
				description
			};

			const { data, error } = await supabase
				.from('user_stuff')
				.insert(stuffToDb(newStuff as Stuff))
				.select();

			if (error) {
				Logger.debug(`${loggerName}: Error inserting new row for my stuff: ${prettyJson(error)}`);
				return { error: 'unknown' };
			}

			if (!data || data?.length === 0) {
				return { error: 'unknown' };
			}

			let newStuffFromDb = stuffFromDbList(data as StuffFromDb[], user?.id)[0];

			const uploadPhotos = await fetch(`/api/stuff/${newStuffFromDb?.id}/photos`, {
				method: 'POST',
				body: formData
			});

			if (!uploadPhotos.ok) {
				Logger.error(`${loggerName}: Error uploading photos for new stuff`);
			} else {
				const photoNamesResponse = await fetch(`/api/stuff/${newStuffFromDb?.id}/photo-names`);
				if (!photoNamesResponse.ok) {
					Logger.error(
						`${loggerName}: Unable to upload photos for my stuff. Error fetching photo names.`
					);
					return { error: 'unknown' };
				}

				const { photoNames } = (await photoNamesResponse.json()) as PhotoNamesResponse;

				Logger.debug(
					`${loggerName}: Setting file "${photoNames[0]}" as default image for new Stuff item`
				);

				const firstFile = formData.get(`new_photo_0`) as File;
				newStuffFromDb.imageUrl = photoNames[0] || firstFile ? firstFile.name : '';

				if (newStuffFromDb.imageUrl) {
					const { error } = await supabase
						.from('user_stuff')
						.update(stuffToDb(newStuffFromDb))
						.eq('id', newStuffFromDb.id);

					if (error) {
						Logger.error(`${loggerName}: Error setting default photo name on stuff object.`);
					}
				} else {
					Logger.error(`${loggerName}: Error setting default photo name on stuff object.`);
				}
			}

			Logger.debug(`${loggerName}: Successfully created new My Stuff w/id: ${newStuffFromDb?.id}.`);

			return { success: true };
		}
	},

	remove: async ({ request, fetch, locals: { safeGetSession } }) => {
		const { user } = await safeGetSession();
		if (!user) {
			redirect(303, '/auth/login');
		}

		const formData = await request.formData();
		const stuffId = formData.get('stuff-id') as string;

		if (!stuffId) {
			return { error: 'id missing', invalid: true };
		}

		Logger.debug(`${loggerName}: Attempting to remove stuff w/id: ${stuffId}.`);

		const removed = await fetch(`/api/my-stuff/${stuffId}`, {
			method: 'DELETE'
		});

		if (!removed.ok) {
			return { error: 'unknown' };
		}

		Logger.debug(`${loggerName}: Successfully removed stuff w/id: ${stuffId}. Redirecting user...`);

		redirect(303, '/my-stuff');
	}
} satisfies Actions;
