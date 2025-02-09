import { error, redirect } from '@sveltejs/kit';
import * as auth from '$lib/server/auth';
import type { Actions } from './$types';

export const actions: Actions = {
	default: async (event) => {
		// No active session
		if (!event.locals.session) {
			return error(401);
		}

		// No auth cookie found
		const sessionToken = event.cookies.get(auth.sessionCookieName);
		if (!sessionToken) {
			return error(401);
		}

		// Invalidate the session and delete the auth cookie
		await auth.invalidateSession(sessionToken);
		auth.deleteSessionTokenCookie(event);
		return redirect(302, '/login');
	}
};
