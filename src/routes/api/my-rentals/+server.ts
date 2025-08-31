import { Logger } from '$lib/logging/logger';
import { rentalFromDb, RentalStatus, rentalToDb, type MyRental } from '$lib/rental/model/rental';
import { getSupabaseServerClient } from '$lib/server/supabase/supabase';
import { type Stuff } from '$lib/stuff/model/stuff';
import { badRequest, forbidden, ok, unknown } from '$lib/web/http/error-response';
import { prettyJson } from '$lib/web/http/response';
import type { RequestHandler } from '@sveltejs/kit';

const API_NAME = 'My Rentals API';

export const POST: RequestHandler = async ({
	fetch,
	request,
	locals: { supabase, safeGetSession }
}) => {
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

	Logger.debug(
		`${API_NAME} POST: Attempting to place rental reservation (stuff id: ${stuffId}) for user id: ${user?.id}`
	);

	// TODO: run these in a transaction!
	const myRental: MyRental = {
		renterId: stuff.userId,
		renterName: stuff?.userMeta?.userName || 'Unknown Renter', // TODO: remove and get via join on select
		renteeId: user?.id,
		renteeName: 'Unknown Rentee', // TODO: remove and get via join on select
		itemId: parseInt(stuff.id),
		itemName: stuff.name, // TODO: remove and get via join on select
		status: RentalStatus.Reserved
	};

	const { data, error } = await supabase.from('user_rentals').insert(rentalToDb(myRental)).select();

	if (error) {
		Logger.error(`${API_NAME} POST: Error occurred: ${JSON.stringify(error)}`);
	}

	if (!data || data?.length === 0) {
		return unknown(
			`${API_NAME} [POST]: Error occurred at the DB level`,
			'Error occurred at the DB level'
		);
	}

	const rental = rentalFromDb(data[0]);

	const supabaseElevated = getSupabaseServerClient();

	const friendStuffResponse = await supabaseElevated
		.from('user_stuff')
		.update({ rental_id: rental.id })
		.eq('id', stuffId);

	if (friendStuffResponse.error) {
		await supabase
			.from('user_rentals')
			.update({ status: RentalStatus.Rejected })
			.eq('id', rental?.itemId);
		Logger.error(`${API_NAME} POST: Error occurred: ${prettyJson(friendStuffResponse.error)}`);
		return unknown(`Unable to rent item, error placing reservation.`);
	}

	Logger.debug(
		`${API_NAME} POST: Successfully placed rental reservation (stuff id: ${stuffId}) for user id: ${user?.id}`
	);

	return ok(rental);
};
