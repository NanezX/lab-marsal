import type { LayoutServerLoad } from './$types';
import { findExamById } from '$lib/server/utils/dbQueries';
import { error as svelteError } from '@sveltejs/kit';
import { validate } from 'uuid';

export const load: LayoutServerLoad = async ({ params }) => {
	if (!validate(params.exam_id)) {
		svelteError(404, 'ID de exámen no válido');
	}

	const examData = await findExamById(params.exam_id);

	if (!examData) {
		svelteError(404, 'Exámen no encontrado');
	}

	return { examData };
};
