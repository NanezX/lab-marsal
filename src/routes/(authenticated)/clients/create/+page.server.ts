import { superValidate, fail as failForms } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { createPatientSchema } from '$lib/server/utils/zod';
import type { Actions } from './$types';
import { findPatientByDocumentId } from '$lib/server/utils/dbQueries';
import { db } from '$lib/server/db';
import { patient as patientTable } from '$lib/server/db/schema';
import { normalized } from '$lib/shared/utils';
import { AppDataNotSavedError } from '$lib/server/error';
import postgres from 'postgres';
import { failFormResponse } from '$lib/server/utils/failFormResponse';
import { redirect } from 'sveltekit-flash-message/server';

// TODO: Verify what roles can create an exam type (on the action) - (maybe just block the page to those user in the backend)

export const load = async () => {
	const createPatientForm = await superValidate(zod(createPatientSchema));

	return { createPatientForm };
};

export const actions: Actions = {
	default: async (event) => {
		const request = event.request;
		const form = await superValidate(request, zod(createPatientSchema));

		if (!form.valid) {
			console.error(JSON.stringify(form.errors, null, 2));
			// Again, return { form } and things will just work.
			return failForms(400, { form });
		}

		const { firstName, lastName, documentId, birthdate, gender, email, phoneNumber } = form.data;

		if (documentId) {
			// Check if there is a patient with this document ID
			const patientCreated = await findPatientByDocumentId(documentId);

			// Allow to "add" a previous deleted patient
			if (patientCreated !== undefined && patientCreated.deleted === false) {
				// Against some rules to avoid exposing vulnerabilities, we return the 409 error for already taken emails
				// because this is intented to be an internal application on the organization
				return failFormResponse(form, 'Cédula de identidad ya registrada', event.cookies, 409);
			}
		}

		try {
			// Data to add
			const patientData = {
				firstName,
				lastName,
				firstNameNormalized: normalized(firstName),
				lastNameNormalized: normalized(lastName),
				documentId,
				birthdate: new Date(birthdate),
				gender,
				// These two are optional
				email,
				phoneNumber
			};

			const insertedPatient = await db
				.insert(patientTable)
				.values(patientData)
				.onConflictDoUpdate({
					target: patientTable.documentId,
					set: {
						...patientData,
						deleted: false
					}
				})
				.returning({ insertedId: patientTable.id });

			// Get and check the inserted ID
			const insertedId = insertedPatient[0]?.insertedId;
			if (!insertedId) {
				throw new AppDataNotSavedError('No se añadió el paciente');
			}
		} catch (e) {
			// Default message
			let errMsg = 'No se añadió el paciente';

			// Print the error type
			if (e instanceof postgres.PostgresError) {
				console.error('PostgresError');
				errMsg = errMsg + ' - PG';
			} else if (e instanceof AppDataNotSavedError) {
				errMsg = e.message;
			} else if (e instanceof Error) {
				console.error('Unknown error');
			}

			// Print the error
			console.error(e);

			return failFormResponse(form, errMsg, event.cookies, 500);
		}

		redirect(
			'/clients',
			{ type: 'success', message: 'Paciente añadido correctamente' },
			event.cookies
		);
	}
};
