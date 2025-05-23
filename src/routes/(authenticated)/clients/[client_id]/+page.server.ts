import { db } from '$lib/server/db';
import { exam as examTable, patient as patientTable } from '$lib/server/db/schema';
import { superValidate, fail as failForms, message } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { deletePatientSchema } from '$lib/server/utils/zod';
import type { Actions, PageServerLoad } from './$types';
import { count, eq, and } from 'drizzle-orm';
import { findPatientById } from '$lib/server/utils/dbQueries';
import { redirect } from 'sveltekit-flash-message/server';

// TODO: Verify what roles can delete an patient (on the action) - (maybe just block the page to those user in the backend)

export const load: PageServerLoad = async ({ params, url }) => {
	// Load exams for this patientId
	const patientId = params.client_id;

	// Get the param queries
	let limit = Number(url.searchParams.get('limit') || 12);
	const skip = Number(url.searchParams.get('skip') || 0);

	// Max size at 12
	if (limit > 12) limit = 12;

	const { count: countTotal, data: patienExamsData } = await db.transaction(async (tx) => {
		// Save the where clause for reusability
		const whereFilter = and(eq(examTable.patientId, patientId), eq(examTable.deleted, false));

		const countTotal = await tx.select({ count: count() }).from(examTable).where(whereFilter);

		const patientExams = await tx.query.exam.findMany({
			limit,
			offset: skip,
			where: whereFilter,
			orderBy: (examTable, { desc }) => [desc(examTable.createdAt)],
			columns: {
				id: true,
				createdAt: true,
				priority: true,
				status: true,
				deliveredAt: true,
				paid: true
			},
			with: {
				examType: {
					columns: { name: true }
				}
			}
		});

		return { count: countTotal, data: patientExams };
	});

	// Create the form for deleting (if desired)
	const deletePatientForm = await superValidate({ patientId }, zod(deletePatientSchema));

	return { deletePatientForm, patienExamsData, totalExamsCount: countTotal[0].count };
};

export const actions: Actions = {
	default: async (event) => {
		const request = event.request;
		const form = await superValidate(request, zod(deletePatientSchema));

		if (!form.valid) {
			console.log('form not valid');
			console.log(JSON.stringify(form.errors, null, 2));
			// Again, return { form } and things will just work.
			return failForms(400, { form });
		}

		const { patientId } = form.data;

		// Check if there is a Patient with this ID
		const patientFound = await findPatientById(patientId);
		if (patientFound === undefined) {
			return message(
				form,
				{ text: 'ID del paciente no encontrado', type: 'error' },
				{ status: 409 }
			);
		}

		try {
			// Soft deleting all the exams and then the patient
			// Doing all within the same transaction to handle rollbacks too in case any failure

			await db.transaction(async (tx) => {
				// Soft delete all the exams of this patient
				await tx.update(examTable).set({ deleted: true }).where(eq(examTable.patientId, patientId));

				// Soft delete the patient
				await tx.update(patientTable).set({ deleted: true }).where(eq(patientTable.id, patientId));
			});
		} catch (e) {
			const errMsg = 'No se eliminó el paciente';

			if (e instanceof Error) {
				// Print the error type
				console.error('Unknown error');
			}

			// Print the error
			console.error(e);

			return message(form, { text: errMsg, type: 'error' }, { status: 500 });
		}

		// Redirect outside of the try/catch block to the clients page with a success message
		redirect('/clients', { type: 'success', message: 'Eliminado correctamente' }, event.cookies);
	}
};
