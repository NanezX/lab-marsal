import { UserLoginSchema } from '$lib/server/utils/zod';
import { superValidate, fail as failForms } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { verify } from '@node-rs/argon2';
import * as auth from '$lib/server/auth';
import type { Actions } from './$types';
import { findUserByEmail } from '$lib/server/utils/dbQueries';
import { hashingOptions } from '$lib/server/auth';
import { failFormResponse } from '$lib/server/utils/failFormResponse';
import { redirect } from 'sveltekit-flash-message/server';

export const load = async () => {
	const loginForm = await superValidate(zod(UserLoginSchema));

	return { loginForm };
};

export const actions: Actions = {
	login: async (event) => {
		const request = event.request;
		const form = await superValidate(request, zod(UserLoginSchema));

		if (!form.valid) {
			// Again, return { form } and things will just work.
			return failForms(400, { form });
		}

		// Obtain all the data from the login form
		const { email, password } = form.data;

		// Query for user with the email
		const existingUser = await findUserByEmail(email.toLowerCase());
		if (!existingUser || existingUser.deleted) {
			return failFormResponse(form, 'Correo o contraseña inválida', event.cookies, 401);
		}

		// Verify password entered
		const validPassword = await verify(existingUser.passwordHash, password, hashingOptions);
		if (!validPassword) {
			return failFormResponse(form, 'Correo o contraseña inválida', event.cookies, 401);
		}

		// Create the session
		const sessionToken = auth.generateSessionToken();
		const session = await auth.createSession(sessionToken, existingUser.id);
		auth.setSessionTokenCookie(event, sessionToken, session.expiresAt);

		redirect(302, '/home', { type: 'success', message: 'Sesión iniciada' }, event.cookies);
	}
};
