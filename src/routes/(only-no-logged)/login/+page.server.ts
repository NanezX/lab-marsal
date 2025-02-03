import { UserLoginSchema } from '$lib/server/utils/zod';
import { superValidate, fail as failForms, message } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { verify } from '@node-rs/argon2';
import { fail, redirect } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import * as auth from '$lib/server/auth';
import { db } from '$lib/server/db';
import * as table from '$lib/server/db/schema';
import type { Actions } from './$types';

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

		const { email, password } = form.data;

		const results = await db
			.select()
			.from(table.user)
			.where(eq(table.user.email, email.toLowerCase()));

		const existingUser = results.at(0);

		if (!existingUser) {
			return message(
				form,
				{ text: 'Incorrect username or password', type: 'error' },
				{ status: 400 }
			);
		}

		// TODO: Use other hashing method??
		const validPassword = await verify(existingUser.passwordHash, password, {
			memoryCost: 19456,
			timeCost: 2,
			outputLen: 32,
			parallelism: 1
		});

		if (!validPassword) {
			return message(
				form,
				{ text: 'Incorrect username or password', type: 'error' },
				{ status: 400 }
			);
		}

		const sessionToken = auth.generateSessionToken();
		const session = await auth.createSession(sessionToken, existingUser.id);
		auth.setSessionTokenCookie(event, sessionToken, session.expiresAt);

		return redirect(302, '/home');
	},

	logout: async (event) => {
		if (!event.locals.session) {
			return fail(401);
		}

		await auth.invalidateSession(event.locals.session.id);
		auth.deleteSessionTokenCookie(event);
		return redirect(302, '/login');
	}
};
