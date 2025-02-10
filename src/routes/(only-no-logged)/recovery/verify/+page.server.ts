import { redirect } from '@sveltejs/kit';
import {
	deleteRecoverySessionCookie,
	recoverySessionCookieName,
	validateRecoveryPasswordSession
} from '$lib/server/auth.js';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { VerifyRecoverySchema } from '$lib/server/utils/zod';

export const load = async (event) => {
	const recoverySessionCookie = event.cookies.get(recoverySessionCookieName);

	// If no recovery sesion cookie, redirect to login
	if (!recoverySessionCookie) {
		return redirect(302, '/login');
	}

	console.log('recoverySessionCookie: ', recoverySessionCookie);

	// Check and validate the recovery session
	const validatedSession = await validateRecoveryPasswordSession(recoverySessionCookie);

	// If invalid recovery session, redirect to login
	if (!validatedSession) {
		deleteRecoverySessionCookie(event);
		return redirect(302, '/login');
	}

	const verifyRecoveryForm = await superValidate(zod(VerifyRecoverySchema));

	return { user: validatedSession.user, verifyRecoveryForm };
};
