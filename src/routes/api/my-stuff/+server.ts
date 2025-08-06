import { Logger } from '$lib/logging/logger';
import {
	stuffFromDbList,
	stuffToDb,
	type NewStuff,
	type Stuff,
	type StuffFromDb
} from '$lib/stuff/model/stuff';
import { forbidden, requiredFieldsMissing, unknown } from '$lib/web/http/error-response';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { RequestHandler } from '@sveltejs/kit';

const API_NAME = 'My Stuff API';

// TODO: consolidate, duped from src\routes\api\my-stuff\[id]\+server.ts
const uploadMyStuffPhotos = async (
	userId: string,
	stuffId: string,
	files: File[],
	supabase: SupabaseClient
): Promise<boolean> => {
	let success = true;

	for (let i = 0; i < files.length; i++) {
		let file = files[i];
		let fileName = file?.name || `${stuffId}_${new Date().getTime()}`;

		const filePath = `${userId}/${stuffId}/images/${fileName}`;
		Logger.debug(`Bucket Path: ${filePath}`);
		const { error } = await supabase.storage
			.from(`user-stuff`)
			.upload(filePath, file, { upsert: true });

		if (error) {
			success = false;
		}
	}

	return success;
};

export const POST: RequestHandler = async ({ request, locals: { supabase, safeGetSession } }) => {
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

	const newStuffFromDb = stuffFromDbList(data as StuffFromDb[])[0];

	Logger.debug(JSON.stringify(newStuffFromDb));

	if (newPhotosCount > 0) {
		const photos: File[] = [];

		for (let i = 0; i < newPhotosCount; i++) {
			const photo = formData.get(`new_photo_${i}`) as File;
			if (photo) {
				photos.push(photo);
			}
		}

		Logger.debug(`Photos to upload: ${photos.length}`);

		const id = newStuffFromDb.id;

		const filesUploaded = await uploadMyStuffPhotos(user?.id, id, photos, supabase);

		if (!filesUploaded) {
			Logger.debug(`${API_NAME} [POST]: Error uploading images to stuff with id: ${id}`);
			return unknown();
		} else {
			Logger.debug(`${API_NAME} [POST]: Success uploading images to stuff with id: ${id}`);
		}
	}

	Logger.debug(`${API_NAME} [POST]: Successfully added New Stuff to the user's inventory!`);

	return new Response(JSON.stringify(newStuffFromDb), {
		status: 201
	});
};
