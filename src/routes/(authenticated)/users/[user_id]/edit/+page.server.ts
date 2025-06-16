import { superValidate, fail as failForms } from 'sveltekit-superforms';
import { UserEditSchema } from '$lib/server/utils/zod';
import { zod } from 'sveltekit-superforms/adapters';
import { cleanEditUserData } from '$lib/shared/utils';
import { validate } from 'uuid';
import type { Actions, PageServerLoad } from './$types';
import { db } from '$lib/server/db';
import { failFormResponse } from '$lib/server/utils/failFormResponse';
import { redirect } from 'sveltekit-flash-message/server';
import { error as svelteError } from '@sveltejs/kit';
import { roleMinimums } from '$lib/shared/utils';
import { findUserByEmail } from '$lib/server/utils/dbQueries';
import { findUserByDocumentId } from '$lib/server/utils/dbQueries';
import { updateUserById } from '$lib/server/utils/dbUpdates';

// TODO: Verify what roles can update an patient (on the action) - (maybe just block the page to those user in the backend)

export const load: PageServerLoad = async ({ params }) => {
	if (!validate(params.user_id)) {
		svelteError(404, 'ID de usuario no válido');
	}

	const foundUser = await db.query.user.findFirst({
		where: (u, { and, eq }) => and(eq(u.id, params.user_id), eq(u.deleted, false)),
		columns: {
			id: true,
			role: true,
			firstName: true,
			lastName: true,
			documentId: true,
			email: true,
			deleted: true
		}
	});

	if (!foundUser || foundUser.deleted) {
		svelteError(404, 'Usuario no encontrado');
	}

	// Clean/format the data for the schema
	const cleaned = cleanEditUserData(foundUser);

	// Create the form for deleting (if desired)
	const editUserForm = await superValidate(cleaned, zod(UserEditSchema));

	const { deleted: _deleted, ...userData } = foundUser;

	return { editUserForm, userData };
};

export const actions: Actions = {
	default: async (event) => {
		console.log('event.params: ', event.params);

		const request = event.request;
		const form = await superValidate(request, zod(UserEditSchema));

		if (!form.valid) {
			console.error(JSON.stringify(form.errors, null, 2));
			// Again, return { form } and things will just work.
			return failForms(400, { form });
		}

		const userId = event.params.user_id;
		const { email, role, documentId } = form.data;

		// Check if there is an user with this ID
		const foundUser = await db.query.user.findFirst({
			where: (u, { and, eq }) => and(eq(u.id, userId), eq(u.deleted, false)),
			columns: {
				id: true,
				email: true,
				role: true,
				documentId: true,
				deleted: true
			}
		});

		if (!foundUser || foundUser.deleted) {
			return failFormResponse(form, 'Usuario no encontrado', event.cookies, 409);
		}

		const dataToUpdate: Partial<typeof form.data> = {};

		// Check if there is a role change requested
		if (foundUser.role != role) {
			dataToUpdate.role = role;

			// ⛔ Check if this role has a minimum defined
			const minRequired = roleMinimums[foundUser.role];

			if (minRequired !== undefined) {
				const countActiveOthers = await db.query.user.findMany({
					where: (u, { and, eq, ne }) =>
						and(eq(u.role, foundUser.role), eq(u.deleted, false), ne(u.id, userId)),
					columns: { id: true }
				});

				if (countActiveOthers.length < minRequired) {
					return failFormResponse(
						form,
						`Debe permanecer al menos ${minRequired} usuario(s) con el rol "${foundUser.role}"`,
						event.cookies,
						400
					);
				}
			}
		}

		// Check if there is an email change requested
		if (foundUser.email != email.toLowerCase()) {
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
		if (foundUser.documentId != documentId) {
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
			// await updateUserById(userId, { email, role, documentId });
			await updateUserById(userId, dataToUpdate);
		} catch (e) {
			console.error(e);
			return failFormResponse(form, 'No se actualizó el usuario', event.cookies, 500);
		}

		// Redirect outside of the try/catch block to the users page with a success message
		redirect(
			'/users',
			{ type: 'success', message: 'Usuario editado correctamente' },
			event.cookies
		);
	}
};
