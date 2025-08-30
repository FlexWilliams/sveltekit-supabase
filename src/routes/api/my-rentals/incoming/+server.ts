import { Logger } from '$lib/logging/logger';
import { rentalFromDbList } from '$lib/rental/model/rental';
import { forbidden, ok, unknown } from '$lib/web/http/error-response';
import type { RequestHandler } from '@sveltejs/kit';

const API_NAME = 'My Rentals [Incoming] API';

export const GET: RequestHandler = async ({ locals: { supabase, safeGetSession } }) => {
	const { user } = await safeGetSession();
	if (!user) {
		return forbidden(`User null.`);
	}

	Logger.debug(`${API_NAME} GET: Attempting to fetch incoming rentals...`);

	const { data, error } = await supabase.from('user_rentals').select().eq('rentee_id', user?.id);

	if (error || !data) {
		Logger.error(`${API_NAME} GET: Error, ${JSON.stringify(error)}`);
		return unknown();
	}

	Logger.debug(`${API_NAME} GET: Successfully fetched ${data?.length} incoming rentals...`);

	return ok(rentalFromDbList(data));
};
