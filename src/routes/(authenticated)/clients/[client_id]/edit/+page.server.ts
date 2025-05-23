import { superValidate, fail as failForms } from 'sveltekit-superforms';
import { editPatientSchema } from '$lib/server/utils/zod';
import { zod } from 'sveltekit-superforms/adapters';
import { cleanEditPatientData, normalized } from '$lib/shared/utils';
import type { Actions, PageServerLoad } from './$types';
import { findPatientById } from '$lib/server/utils/dbQueries';
import { db } from '$lib/server/db';
import { patient as patientTable } from '$lib/server/db/schema';
import { isUniqueConstraintViolation } from '$lib/server/utils/helpers';
import { failFormResponse } from '$lib/server/utils/failFormResponse';
import { redirect } from 'sveltekit-flash-message/server';

// TODO: Support edit. Like firstName, lastName, documentId, birthdate, gender, email phoneNumber

export const load: PageServerLoad = async ({ parent }) => {
	// Get the data from the layout
	const data = await parent();

	// Get the examTypeData
	const { patientData } = data;

	// Clean/format the data for the schema
	const cleaned = cleanEditPatientData(patientData);

	// Create the form for deleting (if desired)
	const editPatientForm = await superValidate(cleaned, zod(editPatientSchema));

	return { editPatientForm };
};

export const actions: Actions = {
	default: async (event) => {
		const request = event.request;
		const form = await superValidate(request, zod(editPatientSchema));

		if (!form.valid) {
			console.log('form not valid');
			console.log(JSON.stringify(form.errors, null, 2));
			// Again, return { form } and things will just work.
			return failForms(400, { form });
		}

		const { patientId, firstName, lastName, documentId, birthdate, gender, email, phoneNumber } =
			form.data;

		// Check if already exists
		const patientSaved = await findPatientById(patientId);
		if (patientSaved === undefined) {
			return failFormResponse(form, 'ID de paciente no encontrado', event.cookies, 409);
		}

		const patientDataUpdate = {
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

		try {
			await db
				.insert(patientTable)
				.values({
					id: patientId,
					...patientDataUpdate
				})
				.onConflictDoUpdate({
					target: patientTable.id,
					set: {
						...patientDataUpdate
					}
				});
		} catch (e) {
			let errMsg = 'No se editó el paciente';

			if (isUniqueConstraintViolation(e, 'patient_document_id_unique')) {
				errMsg = 'Cédula de identidad ya en uso';
			} else if (e instanceof Error) {
				// Print the error type
				console.error('Unknown error');
			}

			// Print the error
			console.error(e);

			return failFormResponse(form, errMsg, event.cookies, 403);
		}

		redirect(
			`/clients/${patientId}`,
			{ type: 'success', message: 'Paciente editado correctamente' },
			event.cookies
		);
	}
};
