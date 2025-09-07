import { ApiLogger } from '$lib/logging/api-logger';
import { RentalStatus, type MyRental } from '$lib/rental/model/rental';
import { getSupabaseServerClient } from '$lib/server/supabase/supabase';
import { badRequest, forbidden, noContent, unknown } from '$lib/web/http/http-responses';
import { prettyJson } from '$lib/web/http/response';
import type { RequestHandler } from '@sveltejs/kit';

const logger = new ApiLogger(`My Rentals [id] Cancel API`);

export const POST: RequestHandler = async ({
	params,
	url,
	fetch,
	locals: { supabase, safeGetSession }
}) => {
	logger.setRequestType('POST');

	const { user } = await safeGetSession();
	if (!user) {
		return forbidden(`Error, user null.`);
	}

	const id = params.id;
	if (!id) {
		return badRequest(`Error, no id.`);
	}

	logger.debug(`Attempting to cancel reservation for rental: ${id}`);

	const rentalResponse = await fetch(`/api/my-rentals/${id}`);
	if (!rentalResponse.ok) {
		logger.error(`Unable to fetch my rental w/id: ${id}`);
	}

	const rental = (await rentalResponse.json()) as MyRental;

	if (rental.status === RentalStatus.Cancelled || rental.status === RentalStatus.Rejected) {
		return noContent(`Reservation is already cancelled or rejected.`);
	}

	const validStatuses = [RentalStatus.Reserved, RentalStatus.Approved];

	if (!validStatuses.some((i) => i === rental.status)) {
		return badRequest(`Unable to cancel reservation as item is already rented. Please return it.`);
	}

	const response = await supabase
		.from('user_rentals')
		.update({
			status: RentalStatus.Cancelled,
			updated_on: new Date().toISOString()
		})
		.eq('id', parseInt(id))
		.eq('rentee_id', user?.id);

	if (response?.error) {
		logger.error(`Error occurred:\n${prettyJson(response?.error)}`);
		return unknown();
	}

	if (response?.status !== 204) {
		return unknown();
	}

	const supabaseElevated = getSupabaseServerClient();

	const friendStuffResponse = await supabaseElevated
		.from('user_stuff')
		.update({ rental_id: null })
		.eq('id', rental?.itemId);

	if (friendStuffResponse.error) {
		logger.error(`Error removing reservation hold on user_stuff item with id: ${rental?.itemId}`);
	}

	return noContent(`Reservation for My Rental w/id ${id} was successfully cancelled`);
};
