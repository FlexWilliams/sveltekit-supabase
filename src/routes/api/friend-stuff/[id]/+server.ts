import { type Stuff } from '$lib/stuff/model/stuff';
import { badRequest, ok, unknown } from '$lib/web/http/error-response';
import type { RequestHandler } from '@sveltejs/kit';

const API_NAME = 'Friend Stuff [id] API';

export const GET: RequestHandler = async ({ params, fetch }) => {
	const { id } = params;
	if (!id) {
		return badRequest(`${API_NAME} [GET] - Error, id null.`);
	}

	const response = await fetch(`/api/stuff/${id}`);

	if (response.ok) {
		const stuff = (await response.json()) as Stuff;
		return ok(stuff);
	} else {
		return unknown();
	}
};
