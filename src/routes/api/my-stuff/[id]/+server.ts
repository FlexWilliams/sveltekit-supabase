import { Logger } from '$lib/logging/logger';
import { stuffToDb, type Stuff, type StuffEdit } from '$lib/stuff/model/stuff';
import {
	badRequest,
	forbidden,
	requiredFieldsMissing,
	unknown
} from '$lib/web/http/error-response';
import type { PhotoNamesResponse } from '$lib/web/http/response';
import type { RequestHandler } from '@sveltejs/kit';

const API_NAME = 'My Stuff [id] API';

export const PUT: RequestHandler = async ({
	request,
	params,
	locals: { supabase, safeGetSession },
	fetch
}) => {
	const { user } = await safeGetSession();
	if (!user) {
		return forbidden(`${API_NAME} [PUT]: Unable to PUT My Stuff, user null.`);
	}

	const id = params.id;
	if (!id) {
		return badRequest(`${API_NAME} [PUT]: Unable to update My Stuff, id null.`);
	}

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
		userId: user?.id,
		name,
		trustLevel: trustLevel,
		available: available == 'true' ? true : false,
		description,
		updatedOn: new Date().toISOString()
	};

	const { error } = await supabase
		.from('user_stuff')
		.update(stuffToDb(stuffEdit as Stuff))
		.eq('id', id);

	if (error) {
		return unknown();
	}

	const uploadPhotos = await fetch(`/api/stuff/${id}/photos`, {
		method: 'POST',
		body: formData
	});

	if (!uploadPhotos.ok) {
		Logger.error(`Error uploading photos for new stuff`);
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
		await fetch(`/api/stuff/${id}/photo-names`)
	).json()) as PhotoNamesResponse;

	Logger.debug(`Attempting to delete Stuff photos: [${photoNames.join('\n')}]\n`);

	photoNames.forEach(async (p) => {
		const removed = await fetch(`/api/stuff/${id}/photo/${p}`, { method: 'DELETE' });

		if (removed.status !== 204) {
			Logger.error(`Error removing photo: ${p} for Stuff w/ id: ${id}. Manual deletion required!`);
		}
	});

	return new Response(null, {
		status: 204
	});
};
