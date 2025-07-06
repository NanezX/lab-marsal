import { superValidate, fail as failForms } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import type { PageServerLoad, Actions } from './$types';
import { deleteOrderSchema } from '$lib/server/utils/zod';
import { findOrderById } from '$lib/server/utils/dbQueries';
import { db } from '$lib/server/db';
import { order as orderTable } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import { redirect } from 'sveltekit-flash-message/server';
import { failFormResponse } from '$lib/server/utils/failFormResponse';

// TODO: Verify what roles can delete an exam (on the action) - (maybe just block the page to those user in the backend)

export const load: PageServerLoad = async ({ parent }) => {
	// Get the data from the layout
	const data = await parent();

	// Get the examData
	const {
		orderData: { id: orderId }
	} = data;

	// Create the form
	const deleteExamForm = await superValidate({ orderId }, zod(deleteOrderSchema));

	return { deleteExamForm };
};

export const actions: Actions = {
	default: async (event) => {
		const request = event.request;
		const form = await superValidate(request, zod(deleteOrderSchema));

		if (!form.valid) {
			console.error(JSON.stringify(form.errors, null, 2));
			// Again, return { form } and things will just work.
			return failForms(400, { form });
		}

		const { orderId } = form.data;

		// Check if there is an Exam with this ID
		const orderFound = await findOrderById(orderId);
		if (orderFound === undefined) {
			return failFormResponse(form, 'ID de la orden no encontrada', event.cookies, 409);
		}

		try {
			// Soft deleting the order
			await db.update(orderTable).set({ deleted: true }).where(eq(orderTable.id, orderId));
		} catch (e) {
			const errMsg = 'No se eliminó la orden';

			if (e instanceof Error) {
				// Print the error type
				console.error('Unknown error');
			}

			// Print the error
			console.error(e);

			return failFormResponse(form, errMsg, event.cookies, 500);
		}

		// Redirect outside of the try/catch block to the exams page with a success message
		redirect('/exams', { type: 'success', message: 'Eliminado correctamente' }, event.cookies);
	}
};
