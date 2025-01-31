import { UserLoginSchema } from '$lib/server/utils/zod';
import { superValidate, fail as failForms } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
///
import { verify } from '@node-rs/argon2';
// import { hash, verify } from '@node-rs/argon2';
// import { encodeBase32LowerCase } from '@oslojs/encoding';
import { fail, redirect } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import * as auth from '$lib/server/auth';
import { db } from '$lib/server/db';
import * as table from '$lib/server/db/schema';
import type { Actions } from './$types';
///

// import { fail as failSvelte } from '@sveltejs/kit';

// TODO: Integrate toastify for the messages

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
			return fail(400, { message: 'Incorrect username or password' });
		}

		// TODO: Use other hashing method??
		const validPassword = await verify(existingUser.passwordHash, password, {
			memoryCost: 19456,
			timeCost: 2,
			outputLen: 32,
			parallelism: 1
		});

		if (!validPassword) {
			return fail(400, { message: 'Incorrect username or password' });
		}

		const sessionToken = auth.generateSessionToken();
		const session = await auth.createSession(sessionToken, existingUser.id);
		auth.setSessionTokenCookie(event, sessionToken, session.expiresAt);

		return redirect(302, '/demo/lucia');
	}
};
