import { createServerClient } from '@supabase/ssr';
import { type Handle, redirect } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';

import { PUBLIC_SUPABASE_ANON_KEY, PUBLIC_SUPABASE_URL } from '$env/static/public';
import { Logger } from '$lib/logging/logger';
import { prettyJson } from '$lib/web/http/response';

// Code courtesy of: https://supabase.com/docs/guides/auth/server-side/sveltekit

const supabase: Handle = async ({ event, resolve }) => {
	/**
	 * Creates a Supabase client specific to this server request.
	 *
	 * The Supabase client gets the Auth token from the request cookies.
	 */
	event.locals.supabase = createServerClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
		cookies: {
			getAll: () => event.cookies.getAll(),
			/**
			 * SvelteKit's cookies API requires `path` to be explicitly set in
			 * the cookie options. Setting `path` to `/` replicates previous/
			 * standard behavior.
			 */
			setAll: (cookiesToSet) => {
				cookiesToSet.forEach(({ name, value, options }) => {
					event.cookies.set(name, value, { ...options, path: '/' });
				});
			}
		}
	});

	/**
	 * Unlike `supabase.auth.getSession()`, which returns the session _without_
	 * validating the JWT, this function also calls `getUser()` to validate the
	 * JWT before returning the session.
	 */
	event.locals.safeGetSession = async () => {
		const {
			data: { session }
		} = await event.locals.supabase.auth.getSession();
		if (!session) {
			Logger.debug(`safeGetSession: No Session`);
			return { session: null, user: null };
		}

		const {
			data: { user },
			error
		} = await event.locals.supabase.auth.getUser();
		if (error) {
			Logger.debug(`safeGetSession: Session, No User`);
			return { session: null, user: null };
		}

		// Logger.debug(`safeGetSession: Session AND User`);
		return { session, user };
	};

	return resolve(event, {
		filterSerializedResponseHeaders(name) {
			/**
			 * Supabase libraries use the `content-range` and `x-supabase-api-version`
			 * headers, so we need to tell SvelteKit to pass it through.
			 */
			return name === 'content-range' || name === 'x-supabase-api-version';
		}
	});
};

const publicAuthRoutes = [
	'/auth/login',
	'/auth/confirm',
	'/auth/magic-link',
	'/api/auth/magic-link'
];

const authGuard: Handle = async ({ event, resolve }) => {
	const { session, user } = await event.locals.safeGetSession();

	// Logger.debug(`authGuard session access token: ${session?.access_token}`);
	// Logger.debug(`authGuard session user id: ${user?.id}`);

	const loggedIn = session && user;

	Logger.debug(event.url.pathname);

	if (loggedIn) {
		if (!user?.user_metadata?.email_verified) {
			Logger.debug(`User email not confirmed yet! Redirecting to confirmation page.`);
			redirect(303, '/auth/confirm-email');
		}

		if (publicAuthRoutes.some((p) => p === event.url.pathname)) {
			Logger.debug(
				`AuthGuard: User attempting to access an auth page but already logged in, redirecting...`
			);
			redirect(303, '/');
		} else {
			return resolve(event);
		}
	} else {
		const code = event.url.searchParams.get('code');

		if (code) {
			Logger.debug(`AuthGuard: Magic Link auth code present, attempting to login...`);

			const {
				data: { session, user },
				error
			} = await event.locals.supabase.auth.exchangeCodeForSession(code);

			if (session && user) {
				Logger.debug(`AuthGuard: User id ${user?.id} logged in via Magic Link!`);
				redirect(303, '/');
			} else {
				Logger.debug(`AuthGuard: Unable to login user via Magic Link!\n${prettyJson(error)}`);
			}
		}

		if (publicAuthRoutes.some((p) => p === event.url.pathname)) {
			return resolve(event);
		} else {
			Logger.debug(`${event.url.pathname} - User not logged in. Redirecting to login page...`);
			redirect(303, '/auth/login');
		}
	}
};

export const handle: Handle = sequence(supabase, authGuard);
