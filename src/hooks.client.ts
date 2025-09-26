import { Logger } from '$lib/logging/logger';
import { prettyJson } from '$lib/web/http/response';
import type { HandleClientError, Reroute } from '@sveltejs/kit';

export const init = () => {
	Logger.error(`[Client hooks]: init called`);
};

export const reroute: Reroute = async ({}) => {
	Logger.debug(`[Client hooks]: reroute() called...`);
	return;
};

export const handleError: HandleClientError = async ({ error }) => {
	Logger.error(`[Client hooks]: error occured: ${prettyJson(error)}`);

	return {
		message: 'Whoops!'
	};
};
