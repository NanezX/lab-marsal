import { superValidate, fail as failForms } from 'sveltekit-superforms';
import { editOrderDetailsSchema } from '$lib/server/utils/zod';
import { zod } from 'sveltekit-superforms/adapters';
import { cleanEditOrderDetails, normalized as _normalized } from '$lib/shared/utils';
import type { Actions, PageServerLoad } from './$types';
import { findOrderById } from '$lib/server/utils/dbQueries';
import { db } from '$lib/server/db';
import { order as orderTable } from '$lib/server/db/schema';
import { failFormResponse } from '$lib/server/utils/failFormResponse';
import { redirect } from 'sveltekit-flash-message/server';
import { eq } from 'drizzle-orm';
import type { ExamPriority } from '$lib/shared/enums';

// TODO: Verify what roles can update an exam (on the action) - (maybe just block the page to those user in the backend)

export const load: PageServerLoad = async ({ parent }) => {
	// Get the data from the layout
	const data = await parent();

	// Get the examData
	const { orderData } = data;

	// Clean/format the data for the schema
	const cleanedData = cleanEditOrderDetails(orderData);

	// Create the form for editing
	const editOrderDetailsForm = await superValidate(cleanedData, zod(editOrderDetailsSchema));

	return { editOrderDetailsForm };
};

export const actions: Actions = {
	default: async (event) => {
		const request = event.request;
		const form = await superValidate(request, zod(editOrderDetailsSchema));

		if (!form.valid) {
			console.error(JSON.stringify(form.errors, null, 2));
			// Again, return { form } and things will just work.
			return failForms(400, { form });
		}

		const { orderId, priority, delivered } = form.data;

		// Check if already exists
		const orderExist = await findOrderById(orderId);
		if (orderExist === undefined) {
			return failFormResponse(form, 'ID de la orden no encontrado', event.cookies, 409);
		}

		try {
			const updateData: {
				priority: ExamPriority;
				deliveredAt?: Date | null;
			} = {
				priority
			};

			// Handle delivery status
			if (delivered === 'Entregado') {
				// Only set deliveredAt if it's currently null
				const currentOrder = await db.query.order.findFirst({
					where: eq(orderTable.id, orderId),
					columns: { deliveredAt: true }
				});

				if (!currentOrder?.deliveredAt) {
					updateData.deliveredAt = new Date();
				}
			} else if (delivered === 'No entregado') {
				// Always set to null when not delivered
				updateData.deliveredAt = null;
			}

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
