import { Logger } from '$lib/logging/logger';
import { badRequest, forbidden, noContent, unknown } from '$lib/web/http/error-response';
import type { RequestHandler } from '@sveltejs/kit';

const API_NAME = 'My Rentals [id] API';

// TODO: REVIEW: if delete should really just archive or update the status to "cancelled"
export const DELETE: RequestHandler = async ({ params, locals: { supabase, safeGetSession } }) => {
	const { user } = await safeGetSession();
	if (!user) {
		return forbidden(`${API_NAME} [DELETE]: Unable to delete My Rental, user null.`);
	}

	const id = params.id;

	if (!id) {
		return badRequest(`${API_NAME} [DELETE]: Unable to delete My Rental, no id.`);
	}

	const response = await supabase
		.from('user_rentals')
		.delete()
		.eq('id', parseInt(id))
		.eq('rentee_id', user?.id);

	Logger.debug(`${response?.status}`);

	if (response?.status !== 204) {
		return unknown();
	}

	return noContent(`My Rental w/id ${id} was successfully deleted`);
};
