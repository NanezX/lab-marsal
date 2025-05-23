import { redirect, type Handle } from '@sveltejs/kit';
import * as auth from '$lib/server/auth.js';

const handleAuth: Handle = async ({ event, resolve }) => {
	// Moving root path from `/` to `/home`
	if (event.url.pathname === '/') {
		throw redirect(307, '/home');
	}

	// Get the session token from the cookies
	const sessionToken = event.cookies.get(auth.sessionCookieName);

	// If no session token, set locals to null
	if (!sessionToken) {
		event.locals.user = null;
		event.locals.session = null;
	} else {
		// Validate the ssesion
		const { session, user } = await auth.validateSessionToken(sessionToken);

		if (session) {
			// Refresh the session token cookie if the session is valid
			auth.setSessionTokenCookie(event, sessionToken, session.expiresAt);
		} else {
			// Delete the session token cookie if the session is invalid
			auth.deleteSessionTokenCookie(event);
		}

		// Populate locals with user and session dat
		event.locals.user = user;
		event.locals.session = session;
	}

	// Redirect unauthenticated users to /login
	if (!event.locals.user) {
		// Support for /recovery, /recovery/verify and /login ONLY for no logged users
		if (!event.url.pathname.startsWith('/recovery') && event.url.pathname !== '/login') {
			throw redirect(302, '/login');
		}
	}

	if (event.locals.user && event.url.pathname == '/login') {
		throw redirect(307, '/home');
	}

	return resolve(event);
};

export const handle: Handle = handleAuth;
