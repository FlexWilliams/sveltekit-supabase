import { Logger } from '$lib/logging/logger';
import {
	rentalFromDb,
	rentalFromDbList,
	RentalStatus,
	rentalToDb,
	type MyRental
} from '$lib/rental/model/rental';
import { getSupabaseServerClient } from '$lib/server/supabase/supabase';
import { type Stuff } from '$lib/stuff/model/stuff';
import { badRequest, forbidden, ok, unknown } from '$lib/web/http/error-response';
import type { RequestHandler } from '@sveltejs/kit';

const API_NAME = 'My Rentals API';

export const GET: RequestHandler = async ({ url, locals: { supabase, safeGetSession } }) => {
	const { user } = await safeGetSession();
	if (!user) {
		return forbidden(`${API_NAME} [GET]: Unable to get My Rentals, user null.`);
	}

	const outgoing = url.searchParams.get('outgoing')?.toLowerCase() == 'true';
	const stuffId = url.searchParams.get('stuffId');

	const { data, error } = outgoing
		? await supabase.from('user_rentals').select().eq('renter_id', user?.id)
		: stuffId
			? await supabase
					.from('user_rentals')
					.select()
					.in('status', [RentalStatus.Reserved, RentalStatus.Approved])
					.eq('rentee_id', user?.id)
					.eq('item_id', stuffId)
			: await supabase.from('user_rentals').select().eq('rentee_id', user?.id);

	if (error) {
		Logger.error(JSON.stringify(error));
		return unknown();
	}

	if (!data) {
		return unknown();
	}

	return ok(rentalFromDbList(data));
};

export const POST: RequestHandler = async ({
	fetch,
	request,
	locals: { supabase, safeGetSession }
}) => {
	const { user } = await safeGetSession();
	if (!user) {
		return forbidden(`${API_NAME} [POST]: Unable to create My Rental, user null.`);
	}

	const { stuffId } = await request.json();
	if (!stuffId) {
		return badRequest(`Required fields are missing`);
	}

	const stuff = (await (await fetch(`/api/friend-stuff/${stuffId}`)).json()) as Stuff;

	if (!stuff.available) {
		return badRequest(`Unable to rent item, it is currently unavailable via the owner.`);
	}

	if (stuff.reservedBy) {
		if (stuff.reservedBy === user?.id) {
			return badRequest(`Unable to rent item, it is already reserved by the user requesting.`);
		} else {
			return badRequest(`Unable to rent item, it is reserved by another user.`);
		}
	}

	const supabaseElevated = getSupabaseServerClient();

	const friendStuffResponse = await supabaseElevated
		.from('user_stuff')
		.update({ reserved_by: user?.id })
		.eq('id', stuffId);

	if (friendStuffResponse.error) {
		return unknown(`Unable to rent item, error placing reservation.`);
	}

	const myRental: MyRental = {
		renterId: stuff.userId,
		renterName: stuff?.userMeta?.userName || 'Unknown Renter', // TODO: remove and get via join on select
		renteeId: user?.id,
		renteeName: 'Unknown Rentee', // TODO: remove and get via join on select
		itemId: parseInt(stuff.id),
		itemName: stuff.name,
		status: RentalStatus.Reserved
	};

	Logger.debug(JSON.stringify(rentalToDb(myRental)));

	const { data, error } = await supabase.from('user_rentals').insert(rentalToDb(myRental)).select();

	if (error) {
		Logger.error(JSON.stringify(error));
	}

	if (!data || data?.length === 0) {
		return unknown(
			`${API_NAME} [POST]: Error occurred at the DB level`,
			'Error occurred at the DB level'
		);
	}

	return ok(rentalFromDb(data));
};
