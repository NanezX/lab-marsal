import { UserLoginSchema } from '$lib/server/utils/zod';
import { superValidate, fail as failForms, message } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { verify } from '@node-rs/argon2';
import { redirect } from '@sveltejs/kit';
import * as auth from '$lib/server/auth';
import type { Actions } from './$types';
import { findUserByEmail } from '$lib/server/utils/dbQueries';
import { hashingOptions } from '$lib/server/utils';

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
		const existingUser = await findUserByEmail(email.toLowerCase(), 'deleted');
		if (!existingUser) {
			return message(
				form,
				{ text: 'Correo o contraseña inválida', type: 'error' },
				{ status: 401 }
			);
		}

		// Verify password entered
		const validPassword = await verify(existingUser.passwordHash, password, hashingOptions);
		if (!validPassword) {
			return message(
				form,
				{ text: 'Correo o contraseña inválida', type: 'error' },
				{ status: 401 }
			);
		}

		// Set the session
		const sessionToken = auth.generateSessionToken();
		const session = await auth.createSession(sessionToken, existingUser.id);
		auth.setSessionTokenCookie(event, sessionToken, session.expiresAt);

		return redirect(302, '/home');
	}
};
