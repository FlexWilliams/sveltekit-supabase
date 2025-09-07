import { ApiLogger } from '$lib/logging/api-logger';
import {
	createMyRentalForReservation,
	rentalFromDb,
	RentalStatus,
	rentalToDb
} from '$lib/rental/model/rental';
import { getSupabaseServerClient } from '$lib/server/supabase/supabase';
import { type Stuff } from '$lib/stuff/model/stuff';
import { badRequest, forbidden, ok, unknown } from '$lib/web/http/http-responses';
import { prettyJson } from '$lib/web/http/response';
import type { RequestHandler } from '@sveltejs/kit';

const logger = new ApiLogger(`My Rentals API`);

export const POST: RequestHandler = async ({
	fetch,
	request,
	locals: { supabase, safeGetSession }
}) => {
	logger.setRequestType('POST');

	const { user } = await safeGetSession();
	if (!user) {
		return forbidden(`Error, user null.`);
	}

	const { stuffId } = await request.json();
	if (!stuffId) {
		return badRequest(`Required fields are missing`);
	}

	const stuff = (await (await fetch(`/api/friend-stuff/${stuffId}`)).json()) as Stuff;

	if (!stuff.available) {
		return badRequest(`Unable to rent item, it is currently unavailable via the owner.`);
	}

	if (stuff.rentalId) {
		return badRequest(`Unable to rent item, it is reserved by another user.`);
	}

	logger.debug(
		`Attempting to place rental reservation (stuff id: ${stuffId}) for user id: ${user?.id}`
	);

	// TODO: run these in a transaction!
	const myRental = createMyRentalForReservation(stuff, user?.id);

	const { data, error } = await supabase.from('user_rentals').insert(rentalToDb(myRental)).select();

	if (error) {
		logger.error(`Error occurred: ${JSON.stringify(error)}`);
	}

	if (!data || data?.length === 0) {
		return unknown(`Error occurred at the DB level`, 'Error occurred at the DB level');
	}

	const rental = rentalFromDb(data[0], user?.id);

	const supabaseElevated = getSupabaseServerClient();

	const friendStuffResponse = await supabaseElevated
		.from('user_stuff')
		.update({ rental_id: rental.id })
		.eq('id', stuffId);

	if (friendStuffResponse.error) {
		logger.error(
			`Error making reservation on item w/id: ${stuffId}.\n${prettyJson(friendStuffResponse.error)}`
		);

		logger.debug(`Attempting to reject rental reservation w/id: ${rental?.id}.`);

		await supabase
			.from('user_rentals')
			.update({ status: RentalStatus.Rejected })
			.eq('id', rental?.id);

		logger.debug(`Successfully rejected rental reservation w/id: ${rental?.id}.`);

		return unknown(`Unable to rent item, error placing reservation.`);
	}

	logger.debug(
		`Successfully placed rental reservation (id: ${rental?.id}) (stuff id: ${stuffId}) for user id: ${user?.id}`
	);

	return ok(rental);
};
