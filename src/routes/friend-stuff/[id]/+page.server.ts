import { Logger } from '$lib/logging/logger';
import { redirect } from '@sveltejs/kit';
import type { Actions } from './$types';

const loggerName = '[Friend Stuff [id] Form Actions]';

export const actions: Actions = {
	rent: async ({ request, fetch }) => {
		const formData = await request.formData();
		const stuffId = formData.get('stuff-id') as string;

		if (!stuffId) {
			return { error: 'stuffId empty' };
		}

		Logger.debug(`${loggerName}: Attempting to rent item w/id: ${stuffId}...`);

		const response = await fetch(`/api/my-rentals`, {
			method: 'POST',
			body: JSON.stringify({ stuffId }),
			headers: {
				'Content-Type': 'application/json'
			}
		});

		if (!response.ok) {
			Logger.error(`${loggerName}: Error renting item w/id: ${stuffId}`);
			return { error: 'Unknown' };
		}

		Logger.debug(`${loggerName}: Successfully rented item w/id: ${stuffId}`);

		redirect(303, '/my-rentals');
	},

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

		redirect(303, '/my-rentals');
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
