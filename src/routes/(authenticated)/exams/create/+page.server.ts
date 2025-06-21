import { createExamSchema } from '$lib/server/utils/zod';
import { superValidate, fail as failForms } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import type { Actions } from './$types';
import { redirect } from 'sveltekit-flash-message/server';
import { db } from '$lib/server/db';
import { AppDataNotSavedError } from '$lib/server/error';
import postgres from 'postgres';
import { failFormResponse } from '$lib/server/utils/failFormResponse';
import { findExamTypeById, generateNextExamTag } from '$lib/server/utils/dbQueries';
import { findPatientByDocumentId } from '$lib/server/utils/dbQueries';
import { normalized } from '$lib/shared/utils';
import { patient as patientTable, exam as examTable } from '$lib/server/db/schema';

export const load = async () => {
	const createExamForm = await superValidate(zod(createExamSchema));

	return { createExamForm };
};

export const actions: Actions = {
	default: async (event) => {
		const request = event.request;
		const form = await superValidate(request, zod(createExamSchema));

		if (!form.valid) {
			console.error(JSON.stringify(form.errors, null, 2));
			// Again, return { form } and things will just work.
			return failForms(400, { form });
		}

		// const { patient, examTypeId, customTag, priority } = form.data;
		const { examTypeId, patient, customTag, priority } = form.data;

		let examIdCreated: string = '';

		try {
			await db.transaction(async (tx) => {
				// 1. EXAM TYPE
				// Check for existing exam type
				const existExamType = await findExamTypeById(examTypeId);
				if (!existExamType) {
					// Exam type not found
					throw new AppDataNotSavedError('No se encontró el tipo de exámen');
				}

				// 2. PATIENT
				// The patient ID to be related. Initial as "null" to correctly type check if obtained
				let patientId: string | null = null;

				if (patient.kind == 'existing') {
					// Use an already created patient ID
					patientId = patient.id;
				} else {
					// Create/insert the patient data
					const { firstName, lastName, documentId, birthdate, gender, email, phoneNumber } =
						patient.data;

					if (documentId) {
						// Check if there is a patient with this document ID
						const patientCreated = await findPatientByDocumentId(documentId);

						// Allow to "add" a previous deleted patient
						if (patientCreated !== undefined && patientCreated.deleted === false) {
							// Against some rules to avoid exposing vulnerabilities, we return the 409 error for already taken emails
							// because this is intented to be an internal application on the organization
							throw new AppDataNotSavedError('Cédula de identidad ya registrada', { status: 409 }); // Throw because we are on a tx
						}
					}

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

					const insertedPatient = await tx
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
					patientId = insertedPatient[0]?.insertedId;

					if (!patientId) {
						throw new AppDataNotSavedError('No se guardó el paciente');
					}
				}

				// 3. TAG - CUSTOM TAG

				// Maybe for future: Allow custom configuration for auto tag generation based on app settings
				const tag = customTag.kind == 'manual' ? customTag.tag : await generateNextExamTag(tx);

				// INSERT EXAM DATA
				const examInserted = await tx
					.insert(examTable)
					.values({
						patientId,
						examTypeId,
						customTag: tag,
						priority,
						paid: false
					})
					.returning({ insertedId: examTable.id });

				examIdCreated = examInserted[0]?.insertedId;

				if (!examIdCreated) {
					throw new AppDataNotSavedError('No se guardó el exámen');
				}

				return;
			});
		} catch (e) {
			let errMsg = 'No se añadió el exámen';
			let statusCode = 500;

			// Print the error type
			if (e instanceof postgres.PostgresError) {
				console.error('PostgresError');
				errMsg = errMsg + ' - PG';
			} else if (e instanceof AppDataNotSavedError) {
				errMsg = e.message;
				statusCode = e.status;
			} else if (e instanceof Error) {
				console.error('Unknown error');
			}

			// Print the error
			console.error(e);

			return failFormResponse(form, errMsg, event.cookies, statusCode);
		}

		// Just a guard, it should NEVER happen due to previous conditionals and try/catch
		// If execution got here, then the exam was created
		if (!examIdCreated) {
			return failFormResponse(form, 'Internal error', event.cookies, 500);
		}

		redirect(
			`/exams/${examIdCreated}`,
			{ type: 'success', message: 'Exámen añadido correctamente' },
			event.cookies
		);
	}
};
