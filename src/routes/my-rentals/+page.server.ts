import { Logger } from '$lib/logging/logger';
import type { Actions, PageServerLoad } from './$types';

// TODO: refactor, also used in src\routes\+layout.server.ts
export const load: PageServerLoad = async ({ locals: { safeGetSession }, cookies }) => {
	const { session } = safeGetSession ? await safeGetSession() : { session: null };
	const { user } = safeGetSession ? await safeGetSession() : { user: null };

	return {
		user,
		session,
		cookies: cookies.getAll()
	};
};

const loggerName = '[My Rentals Form Actions]';

// TODO: consolidate, duped code from src\routes\friend-stuff\[id]\+page.server.ts
export const actions: Actions = {
	cancel: async ({ request, fetch }) => {
		const formData = await request.formData();
		const rentalId = formData.get('rental-id') as string;

		if (!rentalId) {
			return { error: 'rentalId empty' };
		}

		Logger.debug(`${loggerName}: Attempting to cancel rental reservation w/id ${rentalId}`);

		const response = await fetch(`/api/my-rentals/${rentalId}/cancel`, {
			method: 'POST'
		});

		if (!response.ok) {
			Logger.error(`${loggerName}: Error cancelling rental reservation w/id ${rentalId}`);
			return { error: 'unknown' };
		}

		Logger.debug(`${loggerName}: Successfully cancelled rental reservation w/id ${rentalId}`);

		return { success: true };
	},

	reject: async ({ request, fetch }) => {
		const formData = await request.formData();
		const rentalId = formData.get('rental-id') as string;

		if (!rentalId) {
			return { error: 'rentalId empty' };
		}

		Logger.debug(`${loggerName}: Attempting to reject rental reservation w/id ${rentalId}`);

		const response = await fetch(`/api/my-rentals/${rentalId}/reject`, {
			method: 'POST'
		});

		if (!response.ok) {
			Logger.error(`${loggerName}: Error rejecting rental reservation w/id ${rentalId}`);
			return { error: 'unknown' };
		}

		Logger.debug(`${loggerName}: Successfully rejected rental reservation w/id ${rentalId}`);

		return { success: true };
	},

	approve: async ({ request, fetch }) => {
		const formData = await request.formData();
		const rentalId = formData.get('rental-id') as string;

		if (!rentalId) {
			return { error: 'rentalId empty' };
		}

		Logger.debug(`${loggerName}: Attempting to approve rental reservation w/id ${rentalId}`);

		const response = await fetch(`/api/my-rentals/${rentalId}/approve`, {
			method: 'POST'
		});

		if (!response.ok) {
			Logger.error(`${loggerName}: Error approveing rental reservation w/id ${rentalId}`);
			return { error: 'unknown' };
		}

		Logger.debug(`${loggerName}: Successfully approved rental reservation w/id ${rentalId}`);

		return { success: true };
	}
};
