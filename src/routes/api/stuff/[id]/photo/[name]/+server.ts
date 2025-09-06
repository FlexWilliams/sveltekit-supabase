import { ApiLogger } from '$lib/logging/api-logger';
import { getPhotoSizeDimensions, PHOTO_SIZES } from '$lib/photo/model/photo';
import type { Stuff } from '$lib/stuff/model/stuff';
import {
	badRequest,
	forbidden,
	noContent,
	notFound,
	ok,
	unknown
} from '$lib/web/http/error-response';
import { prettyJson } from '$lib/web/http/response';
import type { RequestHandler } from '@sveltejs/kit';

const logger = new ApiLogger('Stuff [id] Photo [name] API');

// TODO: restrict on db side to allow select only amongst friends
export const GET: RequestHandler = async ({
	url,
	params,
	locals: { supabase, safeGetSession },
	fetch
}) => {
	logger.setRequestType('GET');

	const { user } = await safeGetSession();
	if (!user) {
		return forbidden(`Error, user null.`);
	}

	const { id, name } = params;

	if (!id) {
		return badRequest(`Error, id null.`);
	}

	if (!name) {
		return badRequest(`Error, name null.`);
	}

	const stuffResponse = await fetch(`/api/stuff/${id}`);
	if (!stuffResponse.ok) {
		return notFound();
	}

	const stuff = (await stuffResponse.json()) as Stuff;

	let photoSize = url.searchParams.get('size') || '';
	photoSize = PHOTO_SIZES.indexOf(photoSize) !== -1 ? photoSize : 'preview';
	const dimensions = getPhotoSizeDimensions(photoSize);

	const filePath = `${stuff?.userId}/${id}/photos/raw/${name}`;

	const {
		data: { signedUrl },
		error
	} = await supabase.storage.from(`stuff`).createSignedUrl(
		filePath,
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
		logger.debug(`Error: photo not found: ${filePath}\n${prettyJson(error)}`);
		return notFound();
	}

	if (signedUrl as string) {
		return ok(signedUrl);
	} else {
		return unknown(`Photo name found, but unable to get signed url!`);
	}
};

// TODO: restrict on db side to allow deletion only by owner
export const DELETE: RequestHandler = async ({ params, locals: { supabase, safeGetSession } }) => {
	logger.setRequestType('DELETE');

	const { user } = await safeGetSession();
	if (!user) {
		return forbidden(`Error: user null.`);
	}

	const { id, name } = params;

	if (!id) {
		return badRequest(`Error, id null.`);
	}

	if (!name) {
		return badRequest(`Error, name null.`);
	}

	const filePaths = PHOTO_SIZES.map((size) => {
		return `${user?.id}/${id}/photos/${size}/${name}`;
	});

	logger.debug(`Attempting to delete photo w/name ${name} for my stuff w/id ${id}...`);

	const { error } = await supabase.storage.from(`stuff`).remove(filePaths);

	if (error) {
		logger.error(`Error: photo not found.\n${prettyJson(error)}`);
		return notFound();
	}

	logger.debug(`Successfully deleted photo w/name ${name} for my stuff w/id ${id}...`);

	return noContent();
};
