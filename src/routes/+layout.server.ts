import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals: { safeGetSession }, cookies }) => {
	const { session } = safeGetSession ? await safeGetSession() : { session: null };
	const { user } = safeGetSession ? await safeGetSession() : { user: null };

	return {
		user,
		session,
		cookies: cookies.getAll()
	};
};
