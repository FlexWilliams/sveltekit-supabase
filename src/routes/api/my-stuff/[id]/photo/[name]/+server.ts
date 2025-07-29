import { Logger } from '$lib/logging/logger';
import { badRequest, forbidden } from '$lib/web/http/error-response';
import type { RequestHandler } from '@sveltejs/kit';

const API_NAME = 'My Stuff [id] Photo [name] API';

export const GET: RequestHandler = async ({ params, locals: { supabase, safeGetSession } }) => {
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

	const filePath = `${user?.id}/${id}/images/${name}`;

	const { data, error } = await supabase.storage.from(`user-stuff`).download(`${filePath}`);

	if (error) {
		Logger.debug(`${API_NAME} [GET]: Error: photo not found.`);

		return new Response(null, {
			status: 404
		});
	}

	const photo = await (data as Blob).arrayBuffer();
	return new Response(photo, {
		status: 200
	});
};

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

	const filePath = `${user?.id}/${id}/images/${name}`;

	const { error } = await supabase.storage.from(`user-stuff`).remove([`${filePath}`]);

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
