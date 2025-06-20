import { findExamById } from '$lib/server/utils/dbQueries';
import { editExamResultsSchema } from '$lib/server/utils/zod';
import { cleanEditExamResults } from '$lib/shared/utils';
import { superValidate, fail as failForms } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { failFormResponse } from '$lib/server/utils/failFormResponse';
import { db } from '$lib/server/db';
import { redirect } from 'sveltekit-flash-message/server';
import { exam as examTable, examResult as examResultTable } from '$lib/server/db/schema';
import type { Actions, PageServerLoad } from './$types';
import { eq } from 'drizzle-orm';

// TODO: Verify what roles can update an exam (on the action) - (maybe just block the page to those user in the backend)

export const load: PageServerLoad = async ({ parent }) => {
	// Get the data from the layout
	const data = await parent();

	// Get the examData
	const { examData } = data;

	// Clean/format the data for the schema
	const cleanedData = cleanEditExamResults(examData);

	// Create the form for editing
	const editExamResultsForm = await superValidate(cleanedData, zod(editExamResultsSchema));

	return { editExamResultsForm };
};

export const actions: Actions = {
	default: async (event) => {
		const request = event.request;
		const form = await superValidate(request, zod(editExamResultsSchema));

		if (!form.valid) {
			console.error(JSON.stringify(form.errors, null, 2));
			// Again, return { form } and things will just work.
			return failForms(400, { form });
		}

		const { examId, sample, observation, results } = form.data;

		// Check if exam exists
		const examExist = await findExamById(examId);
		if (examExist === undefined) {
			return failFormResponse(form, 'ID del exámen no encontrado', event.cookies, 409);
		}

		try {
			// We execute everything on in a single transaction
			db.transaction(async (tx) => {
				//
				await tx.update(examTable).set({ sample, observation }).where(eq(examTable.id, examId));

				for (const result of results) {
					if (result.id) {
						// If the result has an ID, we update the value
						await tx.update(examResultTable).set({
							value: result.value.trim()
						});
					} else {
						const parameterData = await tx.query.parameter.findFirst({
							where: (parameterTable, { eq }) => eq(parameterTable.id, result.parameterId)
						});

						if (!parameterData) {
							throw new Error('Parámetro no encontrado');
						}

						// If the result does not have an ID, we insert it
						// We make the parameter snapshot to preservet the parameter info at the time of result entry
						// This is useful for historical data integrity
						await tx.insert(examResultTable).values({
							examId,
							parameterId: result.parameterId,
							value: result.value,
							parameterSnapshot: {
								position: parameterData.position,
								name: parameterData.name,
								type: parameterData.type,
								category: parameterData.category === null ? undefined : parameterData.category,
								unit: parameterData.unit === null ? undefined : parameterData.unit,
								hasReferences: parameterData.hasReferences,
								referenceValues: parameterData.referenceValues
							}
						});
					}
				}
			});
		} catch (e) {
			const errMsg = 'No se actualizó el resultado';

			if (e instanceof Error) {
				// Print the error type
				console.error('Unknown error');
			}

			// Print the error
			console.error(e);

			return failFormResponse(form, errMsg, event.cookies, 500);
		}

		redirect(
			`/exams/${examId}`,
			{ type: 'success', message: 'Resultados actualizado' },
			event.cookies
		);
	}
};
