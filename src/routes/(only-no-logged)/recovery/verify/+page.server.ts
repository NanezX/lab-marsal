import { redirect } from '@sveltejs/kit';
import {
	deleteRecoverySessionCookie,
	recoverySessionCookieName,
	validateRecoveryPasswordSession
} from '$lib/server/auth.js';
import { superValidate, fail as failForms, message } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { VerifyRecoverySchema } from '$lib/server/utils/zod';
import { error as svelteError } from '@sveltejs/kit';
import type { Actions } from './$types';

export const load = async (event) => {
	const recoverySessionCookie = event.cookies.get(recoverySessionCookieName);

	// If no recovery sesion cookie, redirect to login
	if (!recoverySessionCookie) {
		return redirect(302, '/login');
	}

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

// "verify-recovery"
export const actions: Actions = {
	'verify-recovery': async (event) => {
		const recoverySessionCookie = event.cookies.get(recoverySessionCookieName);

		// If no recovery sesion cookie, and error
		if (!recoverySessionCookie) {
			svelteError(401, { message: 'No hay una sesión de recuperación' });
		}

		// Check and validate the recovery session
		const validatedSession = await validateRecoveryPasswordSession(recoverySessionCookie);

		// If invalid recovery session, and error
		if (!validatedSession) {
			deleteRecoverySessionCookie(event);
			svelteError(401, { message: 'Sesión de recuperación inválida' });
		}

		// After knowing that the session is valid, proceed to the verify the input
		const request = event.request;
		const form = await superValidate(request, zod(VerifyRecoverySchema));

		if (!form.valid) {
			// Again, return { form } and things will just work.
			return failForms(400, { form });
		}

		// Obtain the data from the form
		const { code } = form.data;

		// Obtain the data from the validated session
		const { recoverySession } = validatedSession;

		// The stored code is uppercsae
		if (code.toUpperCase() !== recoverySession.code) {
			return message(
				form,
				{ text: 'El código ingresado es incorrecto', type: 'error' },
				{ status: 401 }
			);
		}

		// Change password

		// Remove the cookie

		// Return success, the front will redirect with goto to the "/LOGIN"
		return message(form, { text: '¡Contraseña cambiada exitosamente!', type: 'success' });
	}
};
