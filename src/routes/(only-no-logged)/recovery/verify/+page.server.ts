import { redirect } from '@sveltejs/kit';
import {
	changedPasswordCookieName,
	deletePasswordChangedCookie,
	deleteRecoverySessionCookie,
	hashingOptions,
	invalidateRecoveryPasswordSession,
	recoverySessionCookieName,
	setPasswordChangedCookie,
	validateRecoveryPasswordSession
} from '$lib/server/auth.js';
import { superValidate, fail as failForms, message } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { VerifyRecoverySchema } from '$lib/server/utils/zod';
import { error as svelteError } from '@sveltejs/kit';
import type { Actions } from './$types';
import { updateUserById } from '$lib/server/utils/dbUpdates';
import { hash } from '@node-rs/argon2';

export const load = async (event) => {
	const verifyRecoveryForm = await superValidate(zod(VerifyRecoverySchema));

	const recoverySessionCookie = event.cookies.get(recoverySessionCookieName);
	const changedPasswordCookie = event.cookies.get(changedPasswordCookieName);

	// If no recovery sesion cookie, redirect to login
	if (!recoverySessionCookie) {
		// Cookie to display modal correctly if applies
		if (changedPasswordCookie) {
			deletePasswordChangedCookie(event);
			return { verifyRecoveryForm };
		}

		return redirect(302, '/login');
	}

	// Check and validate the recovery session
	const validatedSession = await validateRecoveryPasswordSession(recoverySessionCookie);

	// If invalid recovery session, redirect to login
	if (!validatedSession) {
		deleteRecoverySessionCookie(event);
		return redirect(302, '/login');
	}

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
		const { code, password } = form.data;

		// Obtain the data from the validated session
		const { recoverySession, user } = validatedSession;

		// The stored code is uppercsae
		if (code.toUpperCase() !== recoverySession.code) {
			return message(
				form,
				{ text: 'El código ingresado es incorrecto', type: 'error' },
				{ status: 401 }
			);
		}

		// Hash the introduced new password
		const passwordHash = await hash(password, hashingOptions);

		// Update/change the password
		await updateUserById(user.id, { passwordHash });

		// Invalidate the session token
		await invalidateRecoveryPasswordSession(user.id);

		// Remove the cookie
		deleteRecoverySessionCookie(event);

		// Set cookie to display modal correctly
		setPasswordChangedCookie(event);

		// Return success, the front will redirect with goto to the "/LOGIN"
		return message(form, { text: '¡Contraseña cambiada exitosamente!', type: 'success' });
	}
};
