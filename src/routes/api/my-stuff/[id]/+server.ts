import { Logger } from '$lib/logging/logger';
import { stuffToDb, type Stuff, type StuffEdit } from '$lib/stuff/model/stuff';
import {
	badRequest,
	forbidden,
	requiredFieldsMissing,
	unknown
} from '$lib/web/http/error-response';
import type { PhotoNamesResponse } from '$lib/web/http/response';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { RequestHandler } from '@sveltejs/kit';

const API_NAME = 'My Stuff [id] API';

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

export const PUT: RequestHandler = async ({
	request,
	params,
	locals: { supabase, safeGetSession }
}) => {
	const { user } = await safeGetSession();
	if (!user) {
		return forbidden(`${API_NAME} [PUT]: Unable to PUT My Stuff, user null.`);
	}

	const id = params.id;

	if (!id) {
		return badRequest(`${API_NAME} [PUT]: Unable to update My Stuff, id null.`);
	}

	Logger.debug(`${id}, ${user?.id}`);

	const formData = await request.formData();
	const name = formData.get('name') as string;
	const photosCount = parseInt(formData.get('photo_count') as string);
	const newPhotosCount = parseInt(formData.get('new_photo_count') as string);
	const trustLevel = parseInt(formData.get('trust_level') as string);
	const description = formData.get('description') as string;
	const available = formData.get('available') as string;

	if (!name || !trustLevel || (photosCount <= 0 && newPhotosCount <= 0)) {
		return requiredFieldsMissing(`${API_NAME} [PUT]: Unable to update My Stuff`);
	}

	const stuffEdit: StuffEdit = {
		name,
		trustLevel: trustLevel,
		available: available == 'true' ? true : false,
		description,
		updatedOn: new Date().toISOString()
	};

	Logger.debug(JSON.stringify(stuffEdit));
	Logger.debug(JSON.stringify(stuffToDb(stuffEdit as Stuff)));

	const { error } = await supabase
		.from('user_stuff')
		.update(stuffToDb(stuffEdit as Stuff))
		.eq('id', id);

	if (error) {
		return unknown();
	}

	if (newPhotosCount > 0) {
		const photos: File[] = [];

		for (let i = 0; i < newPhotosCount; i++) {
			const photo = formData.get(`new_photo_${i}`) as File;
			if (photo) {
				photos.push(photo);
			}
		}

		Logger.debug(`Photos to upload: ${photos.length}`);

		const filesUploaded = await uploadMyStuffPhotos(user?.id, id, photos, supabase);

		if (!filesUploaded) {
			Logger.debug(`${API_NAME} [PUT]: Error uploading images to stuff with id: ${id}`);
			return unknown();
		} else {
			Logger.debug(`${API_NAME} [PUT]: Success uploading images to stuff with id: ${id}`);
		}
	}

	return new Response(null, {
		status: 204
	});
};

export const DELETE: RequestHandler = async ({
	params,
	locals: { supabase, safeGetSession },
	fetch
}) => {
	const { user } = await safeGetSession();
	if (!user) {
		return forbidden(`${API_NAME} [DELETE]: Unable to delete My Stuff, user null.`);
	}

	const id = params.id;

	if (!id) {
		return badRequest(`${API_NAME} [DELETE]: Unable to delete My Stuff w/id ${id}, user null.`);
	}

	Logger.debug(`${id}, ${user?.id}`);

	const response = await supabase
		.from('user_stuff')
		.delete()
		.eq('id', parseInt(id))
		.eq('user_id', user?.id);

	Logger.debug(`${response?.status}`);

	if (response?.status !== 204) {
		return unknown();
	}

	const { photoNames } = (await (
		await fetch(`/api/my-stuff/${id}/photo-names`)
	).json()) as PhotoNamesResponse;

	const photosToRemove = photoNames.map((p) => `${user?.id}/${id}/images/${p}`);

	Logger.debug(`Attempting to delete My Stuff photos: [${photosToRemove.join('\n')}]\n`);

	const { error } = await supabase.storage.from('user-stuff').remove(photosToRemove);

	if (error) {
		Logger.error(`${API_NAME} [DELETE]: Error deleting stuff images! May require manual removal.`);
	}

	return new Response(null, {
		status: 204
	});
};
