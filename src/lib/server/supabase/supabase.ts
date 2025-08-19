import { SUPABASE_KEY } from '$env/static/private';
import { PUBLIC_SUPABASE_URL } from '$env/static/public';
import { createServerClient } from '@supabase/ssr';
const supabase = createServerClient(PUBLIC_SUPABASE_URL, SUPABASE_KEY, {
	cookies: {
		getAll: () => [],
		/**
		 * SvelteKit's cookies API requires `path` to be explicitly set in
		 * the cookie options. Setting `path` to `/` replicates previous/
		 * standard behavior.
		 */
		setAll: () => {}
	}
});

export const getSupabaseServerClient = () => {
	return supabase;
};
