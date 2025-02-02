// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { redirect, type Handle } from '@sveltejs/kit';
import * as auth from '$lib/server/auth.js';

// TODO: Verify that /login and /register routes are only accessible for non-logged users
// TODO: Redirect to /home (or /) route if logged users go to /login and /register routes

const handleAuth: Handle = async ({ event, resolve }) => {
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

	// // Redirect unauthenticated users to /login
	// if (!event.locals.user && event.url.pathname !== '/login') {
	// 	throw redirect(302, '/login');
	// }

	return resolve(event);
};

export const handle: Handle = handleAuth;
