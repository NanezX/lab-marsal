import type { LayoutServerLoad } from './$types';
import { findOrderById } from '$lib/server/utils/dbQueries';
import { error as svelteError } from '@sveltejs/kit';
import { validate } from 'uuid';

export const load: LayoutServerLoad = async ({ params }) => {
	if (!validate(params.exam_id)) {
		svelteError(404, 'ID de orden no válido');
	}

	// exam_id is in reality the ORDER_ID. Need to fix that naming for url routing
	const orderData = await findOrderById(params.exam_id);

	if (!orderData) {
		svelteError(404, 'Orden no encontrada');
	}

	console.log('orderData: ', orderData);

	return { orderData };
};
