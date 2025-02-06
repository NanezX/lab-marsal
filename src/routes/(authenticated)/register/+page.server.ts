import { UserRegisterSchema } from '$lib/server/utils/zod';
import { superValidate, fail as failForms, message, type ErrorStatus } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { hash } from '@node-rs/argon2';
import { eq } from 'drizzle-orm';
import { db } from '$lib/server/db';
import * as table from '$lib/server/db/schema';
import type { Actions } from './$types';
import postgres from 'postgres';
// import * as auth from '$lib/server/auth';

// import * as auth from '$lib/server/auth';
// import { fail, redirect } from '@sveltejs/kit';
// import type { Actions, PageServerLoad } from './$types';

// export const load: PageServerLoad = async (event) => {
// 	if (!event.locals.user) {
// 		return redirect(302, '/demo/lucia/login');
// 	}
// 	return { user: event.locals.user };
// };

// export const actions: Actions = {
// 	logout: async (event) => {
// 		if (!event.locals.session) {
// 			return fail(401);
// 		}
// 		await auth.invalidateSession(event.locals.session.id);
// 		auth.deleteSessionTokenCookie(event);

// 		return redirect(302, '/demo/lucia/login');
// 	}
// };

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
		const { email, password, name, lastName, role } = form.data;

		const passwordHash = await hash(password, {
			// recommended minimum parameters
			memoryCost: 19456,
			timeCost: 2,
			outputLen: 32,
			parallelism: 1
		});

		try {
			// Moch a random ID
			function getRandomInt(min: number, max: number) {
				min = Math.ceil(min);
				max = Math.floor(max);
				return Math.floor(Math.random() * (max - min + 1)) + min;
			}
			// TODO: Send the real data to the database with the new table format and remove the mocked values
			await db.insert(table.user).values({
				email: email.toLowerCase(),
				passwordHash,
				firstName: name,
				lastName,
				role,
				documentId: getRandomInt(0, 999999999),
				birthdate: new Date(Date.now())
			});

			const results = await db
				.select({ id: table.user.id })
				.from(table.user)
				.where(eq(table.user.email, email.toLowerCase()));

			const existingUser = results.at(0);
			if (!existingUser) {
				// TODO: Handle error
				throw new Error('No se registro el usuario');
			}

			// TODO: This register will be used to create new users, so it should not create the session here
			// TODO: Maybe the password could be send to the email. But need to add later the email functionality (verification and sents)
			// Example at: https://github.com/lucia-auth/example-sveltekit-email-password-2fa/blob/main/src/lib/server/email-verification.ts
			// const sessionToken = auth.generateSessionToken();
			// const session = await auth.createSession(sessionToken, existingUser.id);
			// auth.setSessionTokenCookie(event, sessionToken, session.expiresAt);
		} catch (e) {
			let errMsg = 'Ha ocurrido un error';
			let codeStatus: ErrorStatus = 400;

			// Solo el email tiene el UNIQUE Constraint (error code 23505)
			if (e instanceof postgres.PostgresError && e.code == '23505') {
				errMsg = 'El email ya esta en uso';
				codeStatus = 400;
			} else if (e instanceof Error) {
				console.error(e);
				console.error(e.message);
				errMsg = e.message;
			}

			return message(form, { text: errMsg, type: 'error' }, { status: codeStatus });
		}

		return message(form, { text: 'Usuario creado', type: 'success' });
	}
};
