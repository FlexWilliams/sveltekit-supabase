import { Logger } from '$lib/logging/logger';
import { RentalStatus, type MyRental } from '$lib/rental/model/rental';
import { getSupabaseServerClient } from '$lib/server/supabase/supabase';
import { badRequest, forbidden, noContent, unknown } from '$lib/web/http/error-response';
import type { RequestHandler } from '@sveltejs/kit';

const API_NAME = 'My Rentals [id] Reject API';

export const POST: RequestHandler = async ({
	params,
	fetch,
	locals: { supabase, safeGetSession }
}) => {
	const { user } = await safeGetSession();
	if (!user) {
		return forbidden(`${API_NAME} [POST]: Unable to reject My Rental, user null.`);
	}

	const id = params.id;
	if (!id) {
		return badRequest(`${API_NAME} [POST]: Unable to reject My Rental, no id.`);
	}

	Logger.debug(`${API_NAME} [POST]: Attempting to reject reservation for rental: ${id}`);

	const rental = (await (await fetch(`/api/my-rentals/${id}?outgoing=true`)).json()) as MyRental;

	if (rental.status === RentalStatus.Cancelled || rental.status === RentalStatus.Rejected) {
		return noContent(`Rental is already cancelled or rejected.`);
	}

	const validStatuses = [RentalStatus.Reserved, RentalStatus.Approved];

	if (!validStatuses.some((i) => i === rental.status)) {
		return badRequest(
			`Unable to reject reservation as item is currently being rented. Please wait for your friend to return it.`
		);
	}

	const response = await supabase
		.from('user_rentals')
		.update({
			status: RentalStatus.Rejected,
			updated_on: new Date().toISOString()
		})
		.eq('id', parseInt(id))
		.eq('renter_id', user?.id);

	if (response?.status !== 204) {
		return unknown();
	}

	const supabaseElevated = getSupabaseServerClient();

	const friendStuffResponse = await supabaseElevated
		.from('user_stuff')
		.update({ reserved_by: null })
		.eq('id', rental?.itemId);

	if (friendStuffResponse.error) {
		Logger.error(`Error removing reservation hold on user_stuff item with id: ${rental?.itemId}`);
	}

	return noContent(`Reservation for My Rental w/id ${id} was successfully rejected.`);
};
