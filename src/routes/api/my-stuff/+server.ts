import { Logger } from '$lib/logging/logger';
import {
	stuffFromDbList,
	stuffToDb,
	type NewStuff,
	type Stuff,
	type StuffFromDb
} from '$lib/stuff/model/stuff';
import { forbidden, requiredFieldsMissing, unknown } from '$lib/web/http/error-response';
import type { PhotoNamesResponse } from '$lib/web/http/response';
import type { RequestHandler } from '@sveltejs/kit';

const API_NAME = 'My Stuff API';

export const POST: RequestHandler = async ({
	request,
	locals: { supabase, safeGetSession },
	fetch
}) => {
	const { user } = await safeGetSession();
	if (!user) {
		return forbidden(`${API_NAME} [POST]: Unable to add to My Stuff, user null.`);
	}

	const formData = await request.formData();
	const name = formData.get('name') as string;
	const photosCount = parseInt(formData.get('photo_count') as string);
	const newPhotosCount = parseInt(formData.get('new_photo_count') as string);
	const trustLevel = parseInt(formData.get('trust_level') as string);
	const description = formData.get('description') as string;
	const available = formData.get('available') as string;

	if (!name || !trustLevel || (photosCount <= 0 && newPhotosCount <= 0)) {
		return requiredFieldsMissing(`${API_NAME} [POST]: Unable to add to My Stuff`);
	}

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
		Logger.debug(JSON.stringify(error));
	}

	if (!data || data?.length === 0) {
		return unknown(
			`${API_NAME} [POST]: Error occurred at the DB level`,
			'Error occurred at the DB level'
		);
	}

	let newStuffFromDb = stuffFromDbList(data as StuffFromDb[])[0];

	Logger.debug(JSON.stringify(newStuffFromDb));

	const uploadPhotos = await fetch(`/api/stuff/${newStuffFromDb?.id}/photos`, {
		method: 'POST',
		body: formData
	});

	if (!uploadPhotos.ok) {
		Logger.error(`Error uploading photos for new stuff`);
	} else {
		const { photoNames } = (await (
			await fetch(`/api/stuff/${newStuffFromDb?.id}/photo-names`)
		).json()) as PhotoNamesResponse;

		Logger.debug(`Setting file "${photoNames[0]}" as default image for new Stuff item`);

		const firstFile = formData.get(`new_photo_0`) as File;
		newStuffFromDb.imageUrl = photoNames[0] || firstFile ? firstFile.name : '';

		if (newStuffFromDb.imageUrl) {
			const { error } = await supabase
				.from('user_stuff')
				.update(stuffToDb(newStuffFromDb))
				.eq('id', newStuffFromDb.id);

			if (error) {
				Logger.error(`${API_NAME} [POST]: Error setting default photo name on stuff object.`);
			}
		} else {
			Logger.error(`${API_NAME} [POST]: Error setting default photo name on stuff object.`);
		}
	}

	return new Response(JSON.stringify(newStuffFromDb), {
		status: 201
	});
};
