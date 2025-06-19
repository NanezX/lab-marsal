import { superValidate, fail as failForms } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { UserProfileEditSchema } from '$lib/server/utils/zod';
import type { Actions } from './$types';
import { fail as failSvelte } from '@sveltejs/kit';
import { findUserByDocumentId, findUserByEmail } from '$lib/server/utils/dbQueries';
import { failFormResponse } from '$lib/server/utils/failFormResponse';
import { updateUserById } from '$lib/server/utils/dbUpdates';
import { redirect } from 'sveltekit-flash-message/server';
import { db } from '$lib/server/db';

export const load = async () => {
	const changePasswordForm = await superValidate(zod(UserProfileEditSchema));

	return { changePasswordForm };
};

export const actions: Actions = {
	default: async (event) => {
		// The user must be authenticated to access this page
		// He will be changing his own data only
		if (!event.locals.user) {
			return failSvelte(401, { message: 'Unauthorized' });
		}

		const request = event.request;
		const form = await superValidate(request, zod(UserProfileEditSchema));

		if (!form.valid) {
			console.error(JSON.stringify(form.errors, null, 2));
			// Again, return { form } and things will just work.
			return failForms(400, { form });
		}

		const { firstName, lastName, email, documentId, birthdate } = form.data;

		// Use the user data from the event.locals.user to compare with the form data
		const userData = event.locals.user;

		const foundUser = await db.query.user.findFirst({
			where: (u, { and, eq }) => and(eq(u.id, userData.id), eq(u.deleted, false)),
			columns: {
				id: true,

				deleted: true
			}
		});

		if (!foundUser || foundUser.deleted) {
			return failFormResponse(form, 'Usuario no encontrado', event.cookies, 409);
		}

		// Now we proceed to collect the data to update that is conditionally changed
		const dataToUpdate: Partial<typeof form.data> = {};

		// Check if there is an email change requested
		if (userData.email != email.toLowerCase()) {
			dataToUpdate.email = email;

			// Email should not be on use
			// Check for existing email used (if user is soft deleted, the email will be marked as in use)
			const isEmailUsed = await findUserByEmail(email.toLowerCase(), 'deleted', 'passwordHash');
			if (isEmailUsed) {
				// Against some rules to avoid exposing vulnerabilities, we return the 409 error for already taken emails
				// because this is intented to be an internal application on the organization
				return failFormResponse(form, 'El email ya esta en uso', event.cookies, 409);
			}
		}

		// Check if there is an document Id change requested
		if (userData.documentId != documentId) {
			dataToUpdate.documentId = documentId;

			// Check for existing Document ID used (if user is soft deleted, the document ID will be marked as in use)
			const isDocIdUsed = await findUserByDocumentId(documentId, 'deleted', 'passwordHash');
			if (isDocIdUsed) {
				// Against some rules to avoid exposing vulnerabilities, we return the 409 error for already taken emails
				// because this is intented to be an internal application on the organization
				return failFormResponse(form, 'La cédula ya esta en uso', event.cookies, 409);
			}
		}

		try {
			await updateUserById(userData.id, {
				...dataToUpdate,
				firstName,
				lastName,
				birthdate: new Date(birthdate)
			});
		} catch (e) {
			console.error(e);
			return failFormResponse(form, 'No se actualizó el perfil', event.cookies, 500);
		}

		// Redirect outside of the try/catch block to the account page with a success message
		redirect(
			'/users',
			{ type: 'success', message: 'Perfil actualizado correctamente' },
			event.cookies
		);
	}
};
