import { UserRegisterSchema } from '$lib/server/utils/zod';
import { superValidate, fail as failForms, message } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { hash } from '@node-rs/argon2';
import { db } from '$lib/server/db';
import * as table from '$lib/server/db/schema';
import type { Actions } from './$types';
import postgres from 'postgres';
import { findUserByEmail, findUserByDocumentId } from '$lib/server/utils/dbQueries';
import { hashingOptions } from '$lib/server/auth';
import { error as svelteError } from '@sveltejs/kit';
import { UserRoles } from '$lib/shared/enums';
import { renderRegisteredUser } from '$lib/server/email/renderTemplates';
import { sendEmail } from '$lib/server/email';

// TODO: Implement email strategy to verify accounts/users
// TODO: Maybe the password could be send to the email. But need to add later the email functionality (verification and sents)
// Example at: https://github.com/lucia-auth/example-sveltekit-email-password-2fa/blob/main/src/lib/server/email-verification.ts

export const load = async () => {
	const registerForm = await superValidate(zod(UserRegisterSchema));

	return { registerForm };
};

export const actions: Actions = {
	register: async (event) => {
		// Check for the caller session
		const { session, user } = event.locals;
		if (!session || !user) {
			svelteError(409, { message: 'No se encontro una sesion activa' });
		}

		// Check for the role of the caller
		if (user.role !== UserRoles.Admin) {
			svelteError(409, { message: 'No tiene permisos para registrar usuarios' });
		}

		// Check the data sent
		const request = event.request;
		const form = await superValidate(request, zod(UserRegisterSchema));

		if (!form.valid) {
			// Again, return { form } and things will just work.
			return failForms(400, { form });
		}

		// Obtain all the data from the register form. The repeated password is already checked by Zod
		const { email, password, firstName, lastName, role, documentId, birthdate } = form.data;

		// Check for existing email used (if user is soft deleted, the email will be marked as in use)
		const isEmailUsed = await findUserByEmail(email.toLowerCase(), 'deleted', 'passwordHash');
		if (isEmailUsed) {
			// Against some rules to avoid exposing vulnerabilities, we return the 409 error for already taken emails
			// because this is intented to be an internal application on the organization
			return message(form, { text: 'El email ya esta en uso', type: 'error' }, { status: 409 });
		}

		// Check for existing Document ID used (if user is soft deleted, the document ID will be marked as in use)
		const isDocIdUsed = await findUserByDocumentId(documentId, 'deleted', 'passwordHash');
		if (isDocIdUsed) {
			// Against some rules to avoid exposing vulnerabilities, we return the 409 error for already taken emails
			// because this is intented to be an internal application on the organization
			return message(form, { text: 'La cédula ya esta en uso', type: 'error' }, { status: 409 });
		}

		try {
			// Hash the introduced password
			const passwordHash = await hash(password, hashingOptions);

			// Inserting the user to the database
			await db.insert(table.user).values({
				email: email.toLowerCase(),
				passwordHash,
				firstName,
				lastName,
				role,
				documentId: documentId,
				birthdate: new Date(birthdate)
			});

			// Checkinf if the user was saved
			const existingUser = await findUserByEmail(email.toLowerCase(), 'deleted', 'passwordHash');
			if (!existingUser) {
				// TODO: Handle error with a custom error class
				throw new Error('No se registro el usuario');
			}

			// NOTE: This register will be used to create new users, so it should NOT create the session here.
		} catch (e) {
			// Default message
			let errMsg = 'Ha ocurrido un error';

			// Solo el email tiene el UNIQUE Constraint (error code 23505)
			if (e instanceof postgres.PostgresError) {
				console.error('PostgresError');
				errMsg = errMsg + ' - PG';
			} else if (e instanceof Error) {
				console.error('Unknown error');
				console.error(e);
			}

			return message(form, { text: errMsg, type: 'error' }, { status: 500 });
		}

		// Send welcome email
		const { body } = renderRegisteredUser({
			email,
			firstName,
			lastName,
			role,
			documentId,
			birthdate
		});
		await sendEmail(email, 'Bienvenido a LabMarsal', 'Bienvenido a LabMarsal', body);

		return message(form, { text: 'Usuario creado', type: 'success' });
	}
};
