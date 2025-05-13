import type { PageServerLoad } from './$types';
import { findExamTypeById } from '$lib/server/utils/dbQueries';
import { error as svelteError } from '@sveltejs/kit';
import { validate } from 'uuid';
export const load: PageServerLoad = async ({ params }) => {
	if (!validate(params.exam_type_id)) {
		svelteError(404, 'Exam type ID not valid');
	}

	const examTypeData = await findExamTypeById(params.exam_type_id);

	if (examTypeData == undefined) {
		svelteError(404, 'Exam type not found');
	}

	return { examTypeData };
};
