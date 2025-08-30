import { Logger } from '$lib/logging/logger';
import { rentalFromDb } from '$lib/rental/model/rental';
import { forbidden, notFound, ok, unknown } from '$lib/web/http/error-response';
import type { RequestHandler } from '@sveltejs/kit';

const API_NAME = 'My Rentals [id] API';

export const GET: RequestHandler = async ({
	params,
	url,
	locals: { supabase, safeGetSession }
}) => {
	const { user } = await safeGetSession();
	if (!user) {
		return forbidden(`${API_NAME} [GET]: Unable to get My Rental, user null.`);
	}

	const { id } = params;
	if (!id) {
		return notFound(`Id null`);
	}

	const outgoing = url.searchParams.get('outgoing')?.toLowerCase() == 'true';

	const { data, error } = await supabase
		.from('user_rentals')
		.select()
		.eq('id', id)
		.eq(outgoing ? 'renter_id' : 'rentee_id', user?.id);

	if (error) {
		return unknown();
	}

	if (!data || data.length === 0) {
		return notFound(`My Rental with id ${id} not found.`);
	}

	Logger.debug(JSON.stringify(data));

	return ok(rentalFromDb(data[0]));
};
