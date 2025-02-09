import { UserRegisterSchema } from '$lib/server/utils/zod';
import { superValidate, fail as failForms, message, type ErrorStatus } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { hash } from '@node-rs/argon2';
import { eq } from 'drizzle-orm';
import { db } from '$lib/server/db';
import * as table from '$lib/server/db/schema';
import type { Actions } from './$types';
import postgres from 'postgres';
import { maxDocumentId, minDocumentId } from '$lib/shared/utils';
import { findUserByEmail } from '$lib/server/utils/dbQueries';
import { hashingOptions } from '$lib/server/utils';

export const load = async () => {
	const registerForm = await superValidate(zod(UserRegisterSchema));

	return { registerForm };
};

export const actions: Actions = {
	register: async (event) => {
		// TODO: Check that users role. Only admin can call this endpoint
		// TODO: Implement role save

		const request = event.request;
		const form = await superValidate(request, zod(UserRegisterSchema));

		if (!form.valid) {
			// Again, return { form } and things will just work.
			return failForms(400, { form });
		}

		// Obtain all the data from the register form. The repeated password is already checked by Zod
		const { email, password, firstName, lastName, role, documentId, birthdate } = form.data;

		const isUserFound = await findUserByEmail(email, 'deleted', 'passwordHash');

		if (isUserFound) {
			// Against some rules to avoid exposing vulnerabilities, we return the 409 error for already taken emails
			// because this is intented to be an internal application on the organization
			return message(form, { text: 'El email ya esta en uso', type: 'error' }, { status: 409 });
		}

		// Hash the introduced password
		const passwordHash = await hash(password, hashingOptions);

		try {
			// await db.insert(table.user).values({
			// 	email: email.toLowerCase(),
			// 	passwordHash,
			// 	firstName,
			// 	lastName,
			// 	role,
			// 	documentId: documentId,
			// 	birthdate: new Date(birthdate)
			// });
			// const results = await db
			// 	.select({ id: table.user.id })
			// 	.from(table.user)
			// 	.where(eq(table.user.email, email.toLowerCase()));
			// const existingUser = results.at(0);
			// if (!existingUser) {
			// 	// TODO: Handle error with a custom error class
			// 	throw new Error('No se registro el usuario');
			// }
			// This register will be used to create new users, so it should not create the session here.
			// TODO: Implement email strategy to verify accounts/users
			// TODO: Maybe the password could be send to the email. But need to add later the email functionality (verification and sents)
			// Example at: https://github.com/lucia-auth/example-sveltekit-email-password-2fa/blob/main/src/lib/server/email-verification.ts
		} catch (e) {
			let errMsg = 'Ha ocurrido un error';
			let codeStatus: ErrorStatus = 400;

			console.log('e: ', e);

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
