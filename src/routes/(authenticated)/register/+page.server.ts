import { UserRegisterSchema } from '$lib/server/utils/zod';
import { superValidate, fail as failForms } from 'sveltekit-superforms';
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
import { AppDataNotSavedError } from '$lib/server/error';
import { normalized } from '$lib/shared/utils';
import { failFormResponse } from '$lib/server/utils/failFormResponse';
import { redirect } from 'sveltekit-flash-message/server';

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
			return failFormResponse(form, 'El email ya esta en uso', event.cookies, 409);
		}

		// Check for existing Document ID used (if user is soft deleted, the document ID will be marked as in use)
		const isDocIdUsed = await findUserByDocumentId(documentId, 'deleted', 'passwordHash');
		if (isDocIdUsed) {
			// Against some rules to avoid exposing vulnerabilities, we return the 409 error for already taken emails
			// because this is intented to be an internal application on the organization
			return failFormResponse(form, 'La cédula ya esta en uso', event.cookies, 409);
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
				firstNameNormalized: normalized(firstName),
				lastNameNormalized: normalized(lastName),
				role,
				documentId: documentId,
				birthdate: new Date(birthdate)
			});

			// Checkinf if the user was saved
			const existingUser = await findUserByEmail(email.toLowerCase(), 'deleted', 'passwordHash');
			if (!existingUser) {
				throw new AppDataNotSavedError('No se registró el usuario');
			}

			// NOTE: This register will be used to create new users, so it should NOT create the session here.
		} catch (e) {
			// Default message
			let errMsg = 'Ha ocurrido un error';

			// Solo el email tiene el UNIQUE Constraint (error code 23505)
			if (e instanceof postgres.PostgresError) {
				console.error('PostgresError');
				errMsg = errMsg + ' - PG';
			} else if (e instanceof AppDataNotSavedError) {
				errMsg = e.message;
			} else if (e instanceof Error) {
				console.error('Unknown error');
				console.error(e);
			}

			return failFormResponse(form, errMsg, event.cookies, 500);
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
		await sendEmail(
			email,
			'Bienvenido a LabMarsal',
			`Bienvenido a LabMarsal ${firstName} ${lastName}`,
			body
		);

		redirect(303, '/users', { type: 'success', message: 'Usuario creado' }, event.cookies);
	}
};
