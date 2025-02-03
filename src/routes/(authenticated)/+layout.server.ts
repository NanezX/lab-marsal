import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async (event) => {
	// This seems only to work for type safety, because we have the hook.server.ts already validating the session
	if (!event.locals.user) redirect(302, '/login');

	return { user: event.locals.user };
};
