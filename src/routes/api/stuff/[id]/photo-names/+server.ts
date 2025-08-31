import { ApiLogger } from '$lib/logging/api-logger';
import { PHOTO_SIZES } from '$lib/photo/model/photo';
import { badRequest, forbidden, ok, unknown } from '$lib/web/http/error-response';
import type { RequestHandler } from '@sveltejs/kit';

const logger = new ApiLogger('Stuff [id] Photo Names API');

export const GET: RequestHandler = async ({
	url,
	params,
	locals: { supabase, safeGetSession }
}) => {
	logger.setRequestType('GET');

	const { user } = await safeGetSession();
	if (!user) {
		return forbidden('Error, user null.');
	}

	const id = params.id;

	if (!id) {
		return badRequest('Error, id null.');
	}

	let photoSize = url.searchParams.get('size') || '';
	photoSize = PHOTO_SIZES.indexOf(photoSize) !== -1 ? photoSize : 'preview';

	const folderPath = `${user?.id}/${id}/photos/raw`;

	logger.debug(`Fetching photo names for stuff w/id ${id} under path: ${folderPath}...`);

	const { data, error } = await supabase.storage.from('stuff').list(folderPath, {
		limit: 100,
		offset: 0
	});

	if (error) {
		return unknown();
	}

	logger.debug(`Successfully fetched ${data.length} photos for stuff w/id: ${id}`);

	const photoNames = {
		photoNames: data.map((d: any) => d.name)
	};
	return ok(photoNames);
};
