import { ApiLogger } from '$lib/logging/api-logger';
import { stuffToDb, type Stuff, type StuffEdit } from '$lib/stuff/model/stuff';
import {
	badRequest,
	forbidden,
	requiredFieldsMissing,
	unknown
} from '$lib/web/http/error-response';
import type { PhotoNamesResponse } from '$lib/web/http/response';
import type { RequestHandler } from '@sveltejs/kit';

const logger = new ApiLogger('My Stuff [id] API');

export const PUT: RequestHandler = async ({
	request,
	params,
	locals: { supabase, safeGetSession },
	fetch
}) => {
	logger.setRequestType('PUT');

	const { user } = await safeGetSession();
	if (!user) {
		return forbidden(`Error, user null.`);
	}

	const id = params.id;
	if (!id) {
		return badRequest(`Error, id null.`);
	}

	const formData = await request.formData();
	const name = formData.get('name') as string;
	const photosCount = parseInt(formData.get('photo_count') as string);
	const newPhotosCount = parseInt(formData.get('new_photo_count') as string);
	const trustLevel = parseInt(formData.get('trust_level') as string);
	const description = formData.get('description') as string;
	const available = formData.get('available') as string;

	if (!name || !trustLevel || (photosCount <= 0 && newPhotosCount <= 0)) {
		return requiredFieldsMissing('Error: ');
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
		logger.error(`Error uploading photos for new stuff`);
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
	logger.setRequestType('DELETE');

	const { user } = await safeGetSession();
	if (!user) {
		return forbidden(`Error, user null.`);
	}

	const id = params.id;

	if (!id) {
		return badRequest(`Error, user null.`);
	}

	const response = await supabase
		.from('user_stuff')
		.delete()
		.eq('id', parseInt(id))
		.eq('user_id', user?.id);

	if (response?.status !== 204) {
		return unknown();
	}

	const photoNamesResponse = await fetch(`/api/stuff/${id}/photo-names`);
	if (!photoNamesResponse.ok) {
		logger.error(`Unable to delete photos for my stuff. Error fetching photo names.`);
		return unknown();
	}

	const { photoNames } = (await photoNamesResponse.json()) as PhotoNamesResponse;

	logger.debug(`Attempting to delete Stuff photos: [${photoNames.join('\n')}]\n`);

	photoNames.forEach(async (p) => {
		const removed = await fetch(`/api/stuff/${id}/photo/${p}`, { method: 'DELETE' });

		if (removed.status !== 204) {
			logger.error(`Error removing photo: ${p} for Stuff w/ id: ${id}. Manual deletion required!`);
		}
	});

	logger.debug(`Successfully deleted photos for my stuff w/id ${id}`);

	return new Response(null, {
		status: 204
	});
};
