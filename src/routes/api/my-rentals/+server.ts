import { Logger } from '$lib/logging/logger';
import {
	rentalFromDb,
	rentalFromDbList,
	rentalToDb,
	type MyRental
} from '$lib/rental/model/rental';
import type { Stuff } from '$lib/stuff/model/stuff';
import { badRequest, forbidden, ok, unknown } from '$lib/web/http/error-response';
import type { RequestHandler } from '@sveltejs/kit';

const API_NAME = 'My Rentals API';

export const GET: RequestHandler = async ({
	params,
	url,
	locals: { supabase, safeGetSession }
}) => {
	const { user } = await safeGetSession();
	if (!user) {
		return forbidden(`${API_NAME} [GET]: Unable to get My Rentals, user null.`);
	}

	const outgoing = url.searchParams.get('outgoing')?.toLowerCase() == 'true';

	const filter = outgoing ? `renter_id.eq.${user?.id}` : `rentee_id.eq.${user?.id}`;

	const { data, error } = await supabase.from('user_rentals').select().or(filter);

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

	const { id } = await request.json();
	if (!id) {
		return badRequest(`Required fields are missing`);
	}

	const stuff = (await (await fetch(`/api/friend-stuff/${id}`)).json()) as Stuff;

	const myRental: MyRental = {
		renterId: stuff.userId,
		renterName: stuff?.userMeta?.userName || 'Unknown Renter', // TODO: remove and get via join on select
		renteeId: user?.id,
		renteeName: 'Unknown Rentee', // TODO: remove and get via join on select
		itemId: parseInt(stuff.id),
		itemName: stuff.name
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
