import { ApiLogger } from '$lib/logging/api-logger';
import { Logger } from '$lib/logging/logger';
import { getPhotoSizeDimensions, PHOTO_SIZES } from '$lib/photo/model/photo';
import {
	badRequest,
	forbidden,
	noContent,
	notFound,
	ok,
	requiredFieldsMissing,
	unknown
} from '$lib/web/http/http-responses';
import { prettyJson, type PhotoNamesResponse } from '$lib/web/http/response';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { RequestHandler } from '@sveltejs/kit';

// TODO: refactor code in `/my-stuff` and `/friend-stuff` to wrap around this api
const logger = new ApiLogger('Stuff [id] Photos API');

const uploadMyStuffPhotos = async (
	userId: string,
	stuffId: string,
	files: File[],
	supabase: SupabaseClient
): Promise<boolean> => {
	let success = true;

	for (let i = 0; i < files.length; i++) {
		const file = files[i];
		const fileName = file?.name || `${stuffId}_${new Date().getTime()}`;
		const filePath = `${userId}/${stuffId}/photos/raw/${fileName}`;

		Logger.debug(`Photo upload path: ${filePath}, bytes: ${file.size}`);

		const { error } = await supabase.storage.from(`stuff`).upload(filePath, file, { upsert: true });

		if (error) {
			Logger.debug(`Photo upload error: ${prettyJson(error)}`);
			success = false;
		}
	}

	return success;
};

export const GET: RequestHandler = async ({
	params,
	url,
	locals: { supabase, safeGetSession },
	fetch
}) => {
	logger.setRequestType('GET');

	const { user } = await safeGetSession();
	if (!user) {
		return forbidden(`Error, user null.`);
	}

	const { id } = params;

	if (!id) {
		return badRequest(`Error, id null.`);
	}

	let photoSize = url.searchParams.get('size') || '';
	photoSize = PHOTO_SIZES.indexOf(photoSize) !== -1 ? photoSize : 'preview';
	const dimensions = getPhotoSizeDimensions(photoSize);

	logger.debug(`Fetching photo names for stuff w/id: ${id}...`);

	// TODO: rework to only pull the imageUrl from my stuff property! or default to this below if not set
	const { photoNames } = (await (
		await fetch(`/api/stuff/${id}/photo-names`)
	).json()) as PhotoNamesResponse;
	if (photoNames.length === 0) {
		return notFound();
	}

	const fileName = photoNames[0];

	logger.debug(`Fetching signedUrl for default photo for stuff w/id: ${id}...`);

	const {
		data: { signedUrl },
		error
	} = await supabase.storage.from('stuff').createSignedUrl(
		`${id}/photos/${photoSize}/${fileName}`,
		3600,
		dimensions
			? {
					transform: {
						width: dimensions.width,
						height: dimensions.height
					}
				}
			: null
	);

	if (error) {
		logger.error(
			`Error fetching signedUrl for default photo for stuff w/id: ${id}...${prettyJson(error)}`
		);
		return unknown();
	}

	if (signedUrl as string) {
		logger.debug(`Successfully Fetched signedUrl for default photo for stuff w/id: ${id}...`);
		return ok(signedUrl);
	} else {
		logger.error(`Unable to fetch signedUrl for default photo for stuff w/id: ${id}...`);
		return unknown(`Photo name found, but unable to get signed url!`);
	}
};

export const POST: RequestHandler = async ({
	params,
	request,
	locals: { supabase, safeGetSession }
}) => {
	logger.setRequestType('POST');

	const { user } = await safeGetSession();
	if (!user) {
		return forbidden(`Error, user null.`);
	}

	const { id } = params;

	if (!id) {
		return badRequest(`Error, id null.`);
	}

	const formData = await request.formData();
	const newPhotosCount = parseInt(formData.get('new_photo_count') as string);

	if (newPhotosCount <= 0) {
		return requiredFieldsMissing();
	}

	if (newPhotosCount > 0) {
		const photos: File[] = [];

		for (let i = 0; i < newPhotosCount; i++) {
			const photo = formData.get(`new_photo_${i}`) as File;
			if (photo) {
				photos.push(photo);
			}
		}

		logger.debug(`Photos to upload: ${photos.length}`);

		const filesUploaded = await uploadMyStuffPhotos(user?.id, id, photos, supabase);

		if (!filesUploaded) {
			logger.error(`Error uploading photos for stuff with id: ${id}`);
			return unknown();
		} else {
			logger.debug(`Successfully uploaded photos for Stuff ${id}!`);
		}
	}

	return noContent();
};
