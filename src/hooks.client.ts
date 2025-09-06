import { Logger } from '$lib/logging/logger';
import type { Reroute } from '@sveltejs/kit';

export const reroute: Reroute = async ({ url, fetch }) => {
	Logger.debug(`[Client hooks]: reroute() called...`);
	return;
};
