import type { LayoutServerLoad } from './$types';
import { findPatientById } from '$lib/server/utils/dbQueries';
import { error as svelteError } from '@sveltejs/kit';
import { validate } from 'uuid';

export const load: LayoutServerLoad = async ({ params }) => {
	if (!validate(params.client_id)) {
		svelteError(404, 'ID de paciente no válido');
	}

	const patientData = await findPatientById(params.client_id);
	console.log('patientData');
	console.log(JSON.stringify(patientData, null, 2));

	if (!patientData) {
		svelteError(404, 'Paciente no encontrado');
	}

	return { patientData };
};
