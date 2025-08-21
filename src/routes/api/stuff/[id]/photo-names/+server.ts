import { Logger } from '$lib/logging/logger';
import { PHOTO_SIZES } from '$lib/photo/model/photo';
import { badRequest, forbidden, unknown } from '$lib/web/http/error-response';
import type { RequestHandler } from '@sveltejs/kit';

const API_NAME = 'Stuff [id] Photo Names API';

export const GET: RequestHandler = async ({
	url,
	params,
	locals: { supabase, safeGetSession }
}) => {
	const { user } = await safeGetSession();
	if (!user) {
		return forbidden(`${API_NAME} [GET] - Error: user null.`);
	}

	const id = params.id;

	if (!id) {
		return badRequest(`${API_NAME} [GET] - Error: id null.`);
	}

	let photoSize = url.searchParams.get('size') || '';
	photoSize = PHOTO_SIZES.indexOf(photoSize) !== -1 ? photoSize : 'preview';

	const folderPath = `${user?.id}/${id}/photos/raw`;
	const { data, error } = await supabase.storage.from('stuff').list(folderPath, {
		limit: 100,
		offset: 0
	});

	Logger.debug(JSON.stringify(data));

	if (error) {
		return unknown();
	}

	Logger.debug(`${API_NAME} [GET]: Stuff with id: ${id} has ${data.length} photos.`);

	return new Response(
		JSON.stringify({
			photoNames: data.map((d: any) => d.name)
		}),
		{
			status: 200
		}
	);
};
