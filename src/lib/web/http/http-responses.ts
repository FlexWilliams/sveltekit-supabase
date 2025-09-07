import { Logger } from '$lib/logging/logger';

export interface ErrorResponse {
	message: string;
}

export const unknown = (logMessage?: string, clientMessage?: string): Response => {
	if (logMessage) {
		Logger.debug(`${logMessage}`);
	}

	return new Response(clientMessage || null, {
		status: 500,
		statusText: 'Error occurred at the DB level'
	});
};

export const badRequest = (logMessage?: string): Response => {
	if (logMessage) {
		Logger.debug(`${logMessage}`);
	}

	return new Response(null, {
		status: 400
	});
};

export const forbidden = (logMessage?: string): Response => {
	if (logMessage) {
		Logger.debug(`${logMessage}`);
	}

	return new Response(null, {
		status: 403
	});
};

export const notFound = (logMessage?: string): Response => {
	if (logMessage) {
		Logger.debug(`${logMessage}`);
	}

	return new Response(null, {
		status: 404
	});
};

export const ok = (data?: any, logMessage?: string): Response => {
	if (logMessage) {
		Logger.debug(`${logMessage}`);
	}

	data = data ? (typeof data === 'string' ? data : JSON.stringify(data)) : null;

	return new Response(data, {
		status: 200
	});
};

export const blob = (data?: Blob, logMessage?: string): Response => {
	if (logMessage) {
		Logger.debug(`${logMessage}`);
	}

	return new Response(data, {
		status: 200
	});
};

export const noContent = (logMessage?: string): Response => {
	if (logMessage) {
		Logger.debug(`${logMessage}`);
	}

	return new Response(null, {
		status: 204
	});
};

export const requiredFieldsMissing = (logBaseMessage?: string): Response => {
	const message = 'Required fields are missing!';

	if (logBaseMessage) {
		Logger.debug(`${logBaseMessage}: ${message}.`);
	}

	const response: ErrorResponse = { message };
	return new Response(JSON.stringify(response), {
		status: 400,
		statusText: message
	});
};
