import type { PageServerLoad } from './$types';
import { findExamTypeById } from '$lib/server/utils/dbQueries';

export const load: PageServerLoad = async ({ params }) => {
	const examTypeData = await findExamTypeById(params.exam_type_id);

	return { examTypeData };
};
