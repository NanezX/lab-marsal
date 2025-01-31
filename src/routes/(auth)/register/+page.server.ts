import { UserRegisterSchema } from '$lib/server/utils/zod';
import { superValidate, fail as failForms } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { hash } from '@node-rs/argon2';
import { fail, redirect } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import * as auth from '$lib/server/auth';
import { db } from '$lib/server/db';
import * as table from '$lib/server/db/schema';
import type { Actions } from './$types';

export const load = async () => {
	const registerForm = await superValidate(zod(UserRegisterSchema));

	return { registerForm };
};

export const actions: Actions = {
	register: async (event) => {
		const request = event.request;
		const form = await superValidate(request, zod(UserRegisterSchema));

		if (!form.valid) {
			// Again, return { form } and things will just work.
			return failForms(400, { form });
		}

		// TODO: Implement role save
		const { email, password, fullname, username } = form.data;

		const passwordHash = await hash(password, {
			// recommended minimum parameters
			memoryCost: 19456,
			timeCost: 2,
			outputLen: 32,
			parallelism: 1
		});

		try {
			await db.insert(table.user).values({
				email: email.toLowerCase(),
				fullname,
				username,
				passwordHash,
				role: table.UserRoles.secretaria
			});

			const results = await db
				.select({ id: table.user.id })
				.from(table.user)
				.where(eq(table.user.email, email.toLowerCase()));

			const existingUser = results.at(0);
			if (!existingUser) {
				throw new Error('No se registro el usuario');
			}

			const sessionToken = auth.generateSessionToken();
			const session = await auth.createSession(sessionToken, existingUser.id);
			auth.setSessionTokenCookie(event, sessionToken, session.expiresAt);
		} catch (e) {
			if (e instanceof Error) {
				console.error(e);
				console.error(e.message);
			}
			return fail(500, { message: 'An error has occurred' });
		}

		return redirect(302, '/');
	}
};
