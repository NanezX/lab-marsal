import { superValidate, fail as failForms } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import type { PageServerLoad, Actions } from './$types';
import { cleanEditExamTypeData, normalized } from '$lib/shared/utils';
import { editExamTypeSchema } from '$lib/server/utils/zod';
import { findExamTypeById } from '$lib/server/utils/dbQueries';
import { db } from '$lib/server/db';
import { examType, parameter as parameterTable } from '$lib/server/db/schema';
import { isUniqueConstraintViolation } from '$lib/server/utils/helpers';
import { inArray, sql } from 'drizzle-orm';
import { redirect } from 'sveltekit-flash-message/server';
import { failFormResponse } from '$lib/server/utils/failFormResponse';
import { getOrCreateClassification } from '$lib/server/utils/dbQueries';

// TODO: Verify what roles can update an exam type (on the action) - (maybe just block the page to those user in the backend)

export const load: PageServerLoad = async ({ parent }) => {
	// Get the data from the layout
	const data = await parent();

	// Get the examTypeData
	const { examTypeData } = data;

	// Clean/format the data for the schema
	const cleaned = cleanEditExamTypeData(examTypeData);

	// Create the form
	const editExamTypeForm = await superValidate(cleaned, zod(editExamTypeSchema));

	return { editExamTypeForm };
};

export const actions: Actions = {
	default: async (event) => {
		const request = event.request;
		const form = await superValidate(request, zod(editExamTypeSchema));

		if (!form.valid) {
			console.log('form not valid');
			console.log(JSON.stringify(form.errors, null, 2));
			// Again, return { form } and things will just work.
			return failForms(400, { form });
		}

		const {
			id,
			name,
			basePrice,
			categories,
			description,
			clasification,
			parameters,
			deletedParameters
		} = form.data;

		// Check if there is a Exam Type with this ID
		const examTypeSaved = findExamTypeById(id);
		if (examTypeSaved === undefined) {
			return failFormResponse(form, 'ID de tipo de exámen no encontrado', event.cookies, 409);
		}

		try {
			// PARAMETERS: ID are uniques
			// Doing update within the same transaction to handle rollbacks too in case any failure
			await db.transaction(async (tx) => {
				// Find or create the classification name
				const classificationId = await getOrCreateClassification(clasification, tx);

				const examTypeData = {
					name,
					nameNormalized: normalized(name),
					description,
					basePrice: basePrice.toString(),
					categories,
					classificationId
				};

				// Upsert the exam type
				await tx
					.insert(examType)
					.values({
						id,
						...examTypeData
					})
					.onConflictDoUpdate({
						target: examType.id,
						set: {
							...examTypeData
						}
					});

				// Upsert modified exam type params
				await tx
					.insert(parameterTable)
					.values(
						parameters.map((param_) => ({
							...param_,
							examTypeId: id
						}))
					)
					.onConflictDoUpdate({
						target: parameterTable.id,
						set: {
							name: sql.raw(`excluded.${parameterTable.name.name}`),
							type: sql.raw(`excluded.${parameterTable.type.name}`),
							position: sql.raw(`excluded.${parameterTable.position.name}`),
							unit: sql.raw(`excluded.${parameterTable.unit.name}`),
							hasReferences: sql.raw(`excluded.${parameterTable.hasReferences.name}`),
							referenceValues: sql.raw(`excluded.${parameterTable.referenceValues.name}`),
							category: sql.raw(`excluded.${parameterTable.category.name}`)
						}
					});

				// Delete the Deleted exam type params
				await tx
					.update(parameterTable)
					.set({ deleted: true })
					.where(inArray(parameterTable.id, deletedParameters));
			});
		} catch (e) {
			let errMsg = 'No se editó el tipo de exámen';

			if (isUniqueConstraintViolation(e, 'exam_type_name_unique')) {
				errMsg = 'Nombre de tipo de exámen en uso';
			} else if (e instanceof Error) {
				// Print the error type
				console.error('Unknown error');
			}

			// Print the error
			console.error(e);

			return failFormResponse(form, errMsg, event.cookies, 403);
		}

		redirect(
			`/exam-type/${id}`,
			{ type: 'success', message: 'Tipo de exámen editado correctamente' },
			event.cookies
		);
	}
};
