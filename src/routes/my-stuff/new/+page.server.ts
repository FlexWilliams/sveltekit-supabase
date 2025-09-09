import { Logger } from '$lib/logging/logger';
import {
	stuffFromDbList,
	stuffToDb,
	type NewStuff,
	type Stuff,
	type StuffFromDb
} from '$lib/stuff/model/stuff';
import { prettyJson, type PhotoNamesResponse } from '$lib/web/http/response';
import { redirect } from '@sveltejs/kit';
import type { Actions } from './$types';

const loggerName = '[My Stuff (new) Form Actions]';

export const actions: Actions = {
	// TODO: merge with code copied from `src\routes\api\my-stuff\+server.ts`
	add: async ({ request, fetch, locals: { safeGetSession, supabase } }) => {
		const { user } = await safeGetSession();
		if (!user) {
			redirect(303, '/auth/login');
		}

		const formData = await request.formData();
		const name = formData.get('name') as string;
		const photosCount = parseInt(formData.get('photo_count') as string);
		const newPhotosCount = parseInt(formData.get('new_photo_count') as string);
		const trustLevel = parseInt(formData.get('trust_level') as string);
		const description = formData.get('description') as string;
		const available = formData.get('available') as string;

		if (!name || !trustLevel || (photosCount <= 0 && newPhotosCount <= 0)) {
			return { error: 'required fields missing', invalid: true };
		}

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

		return redirect(303, `/my-stuff/${newStuffFromDb?.id}`);
	}
} satisfies Actions;
