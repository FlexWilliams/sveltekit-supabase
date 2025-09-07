import { ApiLogger } from '$lib/logging/api-logger';
import { rentalFromDbList } from '$lib/rental/model/rental';
import { forbidden, ok, unknown } from '$lib/web/http/http-responses';
import type { RequestHandler } from '@sveltejs/kit';

const logger = new ApiLogger(`My Rentals [Outgoing] API`);

export const GET: RequestHandler = async ({ locals: { supabase, safeGetSession } }) => {
	logger.setRequestType('GET');

	const { user } = await safeGetSession();
	if (!user) {
		return forbidden(`User null.`);
	}

	logger.debug(`Attempting to fetch outgoing rentals...`);

	const columns = [
		'id',
		'created_on',
		'renter_id',
		'renter_name',
		'rentee_id',
		'rentee_name',
		'item_name',
		'status',
		'item_id',
		'updated_on',
		'image_url',
		`user_stuff!user_rentals_item_id_fkey(
			image_url
		)`
	];

	const { data, error } = await supabase
		.from('user_rentals')
		.select(columns.join(','))
		.eq('renter_id', user?.id);

	if (error || !data) {
		logger.error(`Error, ${JSON.stringify(error)}`);
		return unknown();
	}

	logger.debug(`Successfully fetched ${data?.length} outgoing rentals...`);

	return ok(rentalFromDbList(data));
};
