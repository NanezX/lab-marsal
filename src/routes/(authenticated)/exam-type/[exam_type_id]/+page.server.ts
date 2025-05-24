import { superValidate, fail as failForms } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import type { PageServerLoad, Actions } from './$types';
import { deleteExamTypeSchema } from '$lib/server/utils/zod';
import { findExamTypeById } from '$lib/server/utils/dbQueries';
import { db } from '$lib/server/db';
import { examType, parameter as parameterTable, exam as examTable } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { redirect } from 'sveltekit-flash-message/server';
import { failFormResponse } from '$lib/server/utils/failFormResponse';

// TODO: Verify what roles can delete an exam type (on the action) - (maybe just block the page to those user in the backend)

export const load: PageServerLoad = async ({ parent }) => {
	// Get the data from the layout
	const data = await parent();

	// Get the examTypeData
	const {
		examTypeData: { id: examTypeId }
	} = data;

	// Create the form
	const deleteExamTypeForm = await superValidate({ examTypeId }, zod(deleteExamTypeSchema));

	return { deleteExamTypeForm };
};

export const actions: Actions = {
	default: async (event) => {
		const request = event.request;
		const form = await superValidate(request, zod(deleteExamTypeSchema));

		if (!form.valid) {
			console.error(JSON.stringify(form.errors, null, 2));
			// Again, return { form } and things will just work.
			return failForms(400, { form });
		}

		const { examTypeId } = form.data;

		// Check if there is a Exam Type with this ID
		const examTypeFound = await findExamTypeById(examTypeId);
		if (examTypeFound === undefined) {
			return failFormResponse(form, 'ID de tipo de exámen no encontrado', event.cookies, 409);
		}

		try {
			// Soft deleting all the exams, all the exam type parameters, and then the exam type
			// Doing all within the same transaction to handle rollbacks too in case any failure
			await db.transaction(async (tx) => {
				// Soft delete all the exams of this exam type
				await tx
					.update(examTable)
					.set({ deleted: true })
					.where(eq(examTable.examTypeId, examTypeId));

				// Soft delete all the parameters of this exam type
				await tx
					.update(parameterTable)
					.set({ deleted: true })
					.where(eq(parameterTable.examTypeId, examTypeId));

				// Soft delete the exam type
				await tx.update(examType).set({ deleted: true }).where(eq(examType.id, examTypeId));
			});
		} catch (e) {
			const errMsg = 'No se eliminó el tipo de exámen';

			if (e instanceof Error) {
				// Print the error type
				console.error('Unknown error');
			}

			// Print the error
			console.error(e);

			return failFormResponse(form, errMsg, event.cookies, 500);
		}

		// Redirect outside of the try/catch block to the exam types page with a success message
		redirect('/exam-types', { type: 'success', message: 'Eliminado correctamente' }, event.cookies);
	}
};
