import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import type { PageServerLoad } from './$types';
import type { ExamTypeWithParameters } from '$lib/shared/types';
import { examTypeSchema } from '$lib/server/utils/zod';

// TODO: Verify what roles can update an exam type (on the action)

export const load: PageServerLoad = async ({ parent }) => {
	const data = await parent();

	const { examTypeData } = data;

	function cleanExamTypeData(data: ExamTypeWithParameters) {
		return {
			name: data.name,
			description: data.description ?? undefined,
			basePrice: parseFloat(data.basePrice),
			categories: data.categories,
			parameters: data.parameters.map((p) => ({
				position: p.position,
				name: p.name,
				type: 'text' as const,
				category: p.category ?? undefined,
				unit: p.unit,
				hasReferences: p.hasReferences,
				referenceValues: p.referenceValues
			}))
		};
	}

	const cleaned = cleanExamTypeData(examTypeData);

	const examTypeForm = await superValidate(cleaned, zod(examTypeSchema));

	return { examTypeForm };
};
