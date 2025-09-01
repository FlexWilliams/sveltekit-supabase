import type { LayoutServerLoad } from './$types';

// TODO: refactor, also used in src\routes\+layout.server.ts
export const load: LayoutServerLoad = async ({ locals: { safeGetSession }, cookies }) => {
	const { session } = safeGetSession ? await safeGetSession() : { session: null };
	const { user } = safeGetSession ? await safeGetSession() : { user: null };

	return {
		user,
		session,
		cookies: cookies.getAll()
	};
};
