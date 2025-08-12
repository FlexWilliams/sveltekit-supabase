import { Logger } from '$lib/logging/logger';
import { PHOTO_SIZES } from '$lib/photo/model/photo';
import {
	badRequest,
	forbidden,
	noContent,
	notFound,
	requiredFieldsMissing,
	unknown
} from '$lib/web/http/error-response';
import type { PhotoNamesResponse } from '$lib/web/http/response';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { RequestHandler } from '@sveltejs/kit';

// TODO: refactor code in `/my-stuff` and `/friend-stuff` to wrap around this api

const API_NAME = 'Stuff [id] Photos API';

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

		// TODO: handle resizing here...
		PHOTO_SIZES.forEach(async (p) => {
			const filePath = `${userId}/${stuffId}/photos/${p}/${fileName}`;
			Logger.debug(`Photo upload path: ${filePath}`);
			const { error } = await supabase.storage
				.from(`stuff`)
				.upload(filePath, file, { upsert: true });

			if (error) {
				success = false;
			}
		});
	}

	return success;
};

export const GET: RequestHandler = async ({
	params,
	url,
	locals: { supabase, safeGetSession },
	fetch
}) => {
	const { user } = await safeGetSession();
	if (!user) {
		return forbidden(`${API_NAME} [GET] - Error: user null.`);
	}

	const { id } = params;

	if (!id) {
		return badRequest(`${API_NAME} [GET] - Error: id null.`);
	}

	let photoSize = url.searchParams.get('size') || '';
	photoSize = PHOTO_SIZES.indexOf(photoSize) !== -1 ? photoSize : 'preview';

	// TODO: rework to only pull the imageUrl from my stuff property! or default to this below if not set
	const { photoNames } = (await (
		await fetch(`/api/stuff/${id}/photo-names`)
	).json()) as PhotoNamesResponse;
	if (photoNames.length === 0) {
		return notFound();
	}

	const fileName = photoNames[0];

	const { data, error } = await supabase.storage
		.from('stuff')
		.download(`${id}/photos/${photoSize}/${fileName}`);

	if (error) {
		return unknown();
	}

	if (data as Blob) {
		const photo = await data.arrayBuffer();
		return new Response(photo, {
			status: 200
		});
	} else {
		return unknown(`Photo name found, but unable to download!`);
	}
};

export const POST: RequestHandler = async ({
	params,
	request,
	locals: { supabase, safeGetSession }
}) => {
	const { user } = await safeGetSession();
	if (!user) {
		return forbidden(`${API_NAME} [POST]: Unable to upload Stuff photos, user null.`);
	}

	const { id } = params;

	if (!id) {
		return badRequest(`${API_NAME} [POST] - Error: id null.`);
	}

	const formData = await request.formData();
	const newPhotosCount = parseInt(formData.get('new_photo_count') as string);

	if (newPhotosCount <= 0) {
		return requiredFieldsMissing(`${API_NAME} [POST]: Unable to upload Stuff photos`);
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
			Logger.debug(`${API_NAME} [POST]: Error uploading photos for stuff with id: ${id}`);
			return unknown();
		} else {
			Logger.debug(`${API_NAME} [POST]: Successfully uploaded photos for Stuff ${id}!`);
		}
	}

	return noContent();
};
