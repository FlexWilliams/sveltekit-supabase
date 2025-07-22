import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals: { safeGetSession }, cookies }) => {
	const { session } = safeGetSession ? await safeGetSession() : { session: null };

	return {
		session,
		cookies: cookies.getAll()
	};
};
