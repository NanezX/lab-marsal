import { superValidate, fail as failForms } from 'sveltekit-superforms';
import { editOrderPaymentSchema } from '$lib/server/utils/zod';
import { zod } from 'sveltekit-superforms/adapters';
import { cleanEditOrderPayment, normalized as _normalized } from '$lib/shared/utils';
import type { Actions, PageServerLoad } from './$types';
import { findOrderById } from '$lib/server/utils/dbQueries';
import { db } from '$lib/server/db';
import { order as orderTable } from '$lib/server/db/schema';
import { failFormResponse } from '$lib/server/utils/failFormResponse';
import { redirect } from 'sveltekit-flash-message/server';
import { eq } from 'drizzle-orm';

// TODO: Verify what roles can update an exam (on the action) - (maybe just block the page to those user in the backend)

export const load: PageServerLoad = async ({ parent }) => {
	// Get the data from the layout
	const data = await parent();

	// Get the examData
	const { orderData } = data;

	// Clean/format the data for the schema
	const cleanedData = cleanEditOrderPayment(orderData);

	// Create the form for editing
	const editOrderPaymentForm = await superValidate(cleanedData, zod(editOrderPaymentSchema));

	return { editOrderPaymentForm };
};

export const actions: Actions = {
	default: async (event) => {
		const request = event.request;
		const form = await superValidate(request, zod(editOrderPaymentSchema));

		if (!form.valid) {
			console.error(JSON.stringify(form.errors, null, 2));
			// Again, return { form } and things will just work.
			return failForms(400, { form });
		}

		const { orderId, paid, pricePaid, paymentMethod, paymentRef } = form.data;

		// Check if already exists
		const orderExist = await findOrderById(orderId);
		if (orderExist === undefined) {
			return failFormResponse(form, 'ID de la orden no encontrado', event.cookies, 409);
		}

		try {
			const updateData = {
				paid,
				pricePaid: pricePaid !== undefined ? pricePaid.toString() : null,
				paymentMethod: paymentMethod,
				paymentRef,
				paidAt: paid ? new Date() : undefined
			};

			await db.update(orderTable).set(updateData).where(eq(orderTable.id, orderId));
		} catch (e) {
			const errMsg = 'No se editó la orden';

			if (e instanceof Error) {
				// Print the error type
				console.error('Unknown error');
			}

			// Print the error
			console.error(e);

			return failFormResponse(form, errMsg, event.cookies, 403);
		}

		redirect(`/exams/${orderId}`, { type: 'success', message: 'Orden actualizada' }, event.cookies);
	}
};
