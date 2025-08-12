import { Logger } from '$lib/logging/logger';
import { PHOTO_SIZES } from '$lib/photo/model/photo';
import type { Stuff } from '$lib/stuff/model/stuff';
import { badRequest, forbidden, notFound } from '$lib/web/http/error-response';
import type { RequestHandler } from '@sveltejs/kit';

const API_NAME = 'Stuff [id] Photo [name] API';

// TODO: restrict on db side to allow select only amongst friends
export const GET: RequestHandler = async ({
	url,
	params,
	locals: { supabase, safeGetSession },
	fetch
}) => {
	const { user } = await safeGetSession();
	if (!user) {
		return forbidden(`${API_NAME} [GET] - Error: user null.`);
	}

	const { id, name } = params;

	if (!id) {
		return badRequest(`${API_NAME} [GET] - Error: id null.`);
	}

	if (!name) {
		return badRequest(`${API_NAME} [GET] - Error: name null.`);
	}

	const stuffResponse = await fetch(`/api/stuff/${id}`);
	if (!stuffResponse.ok) {
		Logger.error(`\nAHHHHHHH\n`);
		return notFound();
	}

	const stuff = (await stuffResponse.json()) as Stuff;

	let photoSize = url.searchParams.get('size') || '';
	photoSize = PHOTO_SIZES.indexOf(photoSize) !== -1 ? photoSize : 'preview';

	const filePath = `${stuff?.userId}/${id}/photos/${photoSize}/${name}`;

	const { data, error } = await supabase.storage.from(`stuff`).download(`${filePath}`);

	if (error) {
		Logger.debug(
			`${API_NAME} [GET]: Error: photo not found: ${filePath}\n${JSON.stringify(error)}`
		);

		return new Response(null, {
			status: 404
		});
	}

	const photo = await (data as Blob).arrayBuffer();
	return new Response(photo, {
		status: 200
	});
};

// TODO: restrict on db side to allow deletion only by owner
export const DELETE: RequestHandler = async ({ params, locals: { supabase, safeGetSession } }) => {
	const { user } = await safeGetSession();
	if (!user) {
		return forbidden(`${API_NAME} [DELETE] - Error: user null.`);
	}

	const { id, name } = params;

	if (!id) {
		return badRequest(`${API_NAME} [DELETE] - Error: id null.`);
	}

	if (!name) {
		return badRequest(`${API_NAME} [DELETE] - Error: name null.`);
	}

	const filePaths = PHOTO_SIZES.map((size) => {
		return `${user?.id}/${id}/photos/${size}/${name}`;
	});

	const { error } = await supabase.storage.from(`stuff`).remove(filePaths);

	if (error) {
		Logger.debug(`${API_NAME} [DELETE]: Error: photo not found.`);

		return new Response(null, {
			status: 404
		});
	}

	return new Response(null, {
		status: 204
	});
};
