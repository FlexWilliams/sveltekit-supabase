import { ApiLogger } from '$lib/logging/api-logger';
import { RentalStatus, type MyRental } from '$lib/rental/model/rental';
import { badRequest, forbidden, noContent, unknown } from '$lib/web/http/error-response';
import type { RequestHandler } from '@sveltejs/kit';

const logger = new ApiLogger(`My Rentals [id] Approve API`);

export const POST: RequestHandler = async ({
	params,
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

	logger.debug(`Attempting to approve reservation for rental: ${id}`);

	const rentalResponse = await fetch(`/api/my-rentals/${id}?outgoing=true`);
	if (!rentalResponse.ok) {
		logger.error(`Unable to fetch my rental w/id: ${id}`);
	}

	const rental = (await rentalResponse.json()) as MyRental;

	if (rental.status === RentalStatus.Cancelled || rental.status === RentalStatus.Rejected) {
		return badRequest(`Rental is already cancelled or rejected.`);
	}

	const validStatuses = [RentalStatus.Reserved];

	if (!validStatuses.some((i) => i === rental.status)) {
		return badRequest(
			`Unable to approve reservation as item is currently being rented. Please wait for your friend to return it.`
		);
	}

	const response = await supabase
		.from('user_rentals')
		.update({
			status: RentalStatus.Approved,
			updated_on: new Date().toISOString()
		})
		.eq('id', parseInt(id))
		.eq('renter_id', user?.id);

	if (response?.status !== 204) {
		return unknown();
	}

	logger.debug(`Successfully approved reservation for rental: ${id}`);

	return noContent(`Reservation for My Rental w/id ${id} was successfully approved.`);
};
