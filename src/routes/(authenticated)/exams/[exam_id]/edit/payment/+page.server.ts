import { superValidate, fail as failForms } from 'sveltekit-superforms';
import { editExamPaymentSchema } from '$lib/server/utils/zod';
import { zod } from 'sveltekit-superforms/adapters';
import { cleanEditExamPayment, normalized as _normalized } from '$lib/shared/utils';
import type { Actions, PageServerLoad } from './$types';
import { findExamById } from '$lib/server/utils/dbQueries';
import { db } from '$lib/server/db';
import { exam as examTable } from '$lib/server/db/schema';
import { failFormResponse } from '$lib/server/utils/failFormResponse';
import { redirect } from 'sveltekit-flash-message/server';
import { eq } from 'drizzle-orm';

// TODO: Verify what roles can update an exam (on the action) - (maybe just block the page to those user in the backend)

export const load: PageServerLoad = async ({ parent }) => {
	// Get the data from the layout
	const data = await parent();

	// Get the examData
	const { examData } = data;

	// Clean/format the data for the schema
	const cleanedData = cleanEditExamPayment(examData);

	// Create the form for editing
	const editExamPaymentForm = await superValidate(cleanedData, zod(editExamPaymentSchema));

	return { editExamPaymentForm };
};

export const actions: Actions = {
	default: async (event) => {
		const request = event.request;
		const form = await superValidate(request, zod(editExamPaymentSchema));

		if (!form.valid) {
			console.error(JSON.stringify(form.errors, null, 2));
			// Again, return { form } and things will just work.
			return failForms(400, { form });
		}

		const { examId, paid, pricePaid, paymentMethod, paymentRef } = form.data;

		// Check if already exists
		const patientSaved = await findExamById(examId);
		if (patientSaved === undefined) {
			return failFormResponse(form, 'ID del exámen no encontrado', event.cookies, 409);
		}

		try {
			const updateData = {
				paid,
				pricePaid: pricePaid !== undefined ? pricePaid.toString() : null,
				paymentMethod: paymentMethod,
				paymentRef,
				paidAt: paid ? new Date() : undefined
			};

			await db.update(examTable).set(updateData).where(eq(examTable.id, examId));
		} catch (e) {
			const errMsg = 'No se editó el exámen';

			if (e instanceof Error) {
				// Print the error type
				console.error('Unknown error');
			}

			// Print the error
			console.error(e);

			return failFormResponse(form, errMsg, event.cookies, 403);
		}

		redirect(`/exams/${examId}`, { type: 'success', message: 'Exámen actualizado' }, event.cookies);
	}
};
