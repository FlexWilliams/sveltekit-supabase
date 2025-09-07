import { ApiLogger } from '$lib/logging/api-logger';
import {
	stuffFromDbList,
	stuffToDb,
	type NewStuff,
	type Stuff,
	type StuffFromDb
} from '$lib/stuff/model/stuff';
import { forbidden, requiredFieldsMissing, unknown } from '$lib/web/http/http-responses';
import type { PhotoNamesResponse } from '$lib/web/http/response';
import { prettyJson } from '$lib/web/http/response';
import type { RequestHandler } from '@sveltejs/kit';

const logger = new ApiLogger('My Stuff API');

export const POST: RequestHandler = async ({
	request,
	locals: { supabase, safeGetSession },
	fetch
}) => {
	logger.setRequestType('POST');

	const { user } = await safeGetSession();
	if (!user) {
		return forbidden(`Error, user null.`);
	}

	const formData = await request.formData();
	const name = formData.get('name') as string;
	const photosCount = parseInt(formData.get('photo_count') as string);
	const newPhotosCount = parseInt(formData.get('new_photo_count') as string);
	const trustLevel = parseInt(formData.get('trust_level') as string);
	const description = formData.get('description') as string;
	const available = formData.get('available') as string;

	if (!name || !trustLevel || (photosCount <= 0 && newPhotosCount <= 0)) {
		return requiredFieldsMissing();
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
		logger.debug(`Error inserting new row for my stuff: ${prettyJson(error)}`);
		return unknown();
	}

	if (!data || data?.length === 0) {
		return unknown('Error occurred at the DB level');
	}

	let newStuffFromDb = stuffFromDbList(data as StuffFromDb[], user?.id)[0];

	const uploadPhotos = await fetch(`/api/stuff/${newStuffFromDb?.id}/photos`, {
		method: 'POST',
		body: formData
	});

	if (!uploadPhotos.ok) {
		logger.error(`Error uploading photos for new stuff`);
	} else {
		const photoNamesResponse = await fetch(`/api/stuff/${newStuffFromDb?.id}/photo-names`);
		if (!photoNamesResponse.ok) {
			logger.error(`Unable to upload photos for my stuff. Error fetching photo names.`);
			return unknown();
		}

		const { photoNames } = (await photoNamesResponse.json()) as PhotoNamesResponse;

		logger.debug(`Setting file "${photoNames[0]}" as default image for new Stuff item`);

		const firstFile = formData.get(`new_photo_0`) as File;
		newStuffFromDb.imageUrl = photoNames[0] || firstFile ? firstFile.name : '';

		if (newStuffFromDb.imageUrl) {
			const { error } = await supabase
				.from('user_stuff')
				.update(stuffToDb(newStuffFromDb))
				.eq('id', newStuffFromDb.id);

			if (error) {
				logger.error(`Error setting default photo name on stuff object.`);
			}
		} else {
			logger.error(`Error setting default photo name on stuff object.`);
		}
	}

	logger.debug(`Successfully created new My Stuff w/id: ${newStuffFromDb?.id}.`);

	return new Response(JSON.stringify(newStuffFromDb), {
		status: 201
	});
};
