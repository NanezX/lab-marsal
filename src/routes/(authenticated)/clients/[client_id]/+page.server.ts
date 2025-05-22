import { db } from '$lib/server/db';
import { exam as examTable } from '$lib/server/db/schema';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { deletePatientSchema } from '$lib/server/utils/zod';
import type { PageServerLoad } from './$types';
import { count, eq, and, desc } from 'drizzle-orm';

// TODO: Verify what roles can delete an patient (on the action) - (maybe just block the page to those user in the backend)

export const load: PageServerLoad = async ({ params, url }) => {
	// Load exams for this patientId
	const patientId = params.client_id;

	// Get the param queries
	let limit = Number(url.searchParams.get('limit') || 12);
	const skip = Number(url.searchParams.get('skip') || 0);

	// Max size at 12
	if (limit > 12) limit = 12;

	const { count: countTotal, data: patienExamsData } = await db.transaction(async (tx) => {
		// Save the where clause for reusability
		const whereFilter = and(eq(examTable.patientId, patientId), eq(examTable.deleted, false));

		const countTotal = await tx.select({ count: count() }).from(examTable).where(whereFilter);
		const patientExams = await tx
			.select()
			.from(examTable)
			.where(whereFilter)
			.orderBy(desc(examTable.createdAt))
			.limit(limit)
			.offset(skip);

		return { count: countTotal, data: patientExams };
	});

	const patienExamsData2 = [
		{
			id: 'd9dee7d4-34c8-4e55-bbae-4d8e5343ed8f',
			createdAt: '2025-05-20T05:03:08.634Z',
			// examTypeId: '673f4311-2c99-42cf-875c-d2cb82bfb59b',
			priority: 'normal',
			status: 'active',
			deliveredAt: '2025-05-20T05:03:08.634Z',
			paid: false
		}
	];

	console.log('countTotal: ', JSON.stringify(countTotal, null, 2));
	console.log('patienExamsData: ', JSON.stringify(patienExamsData, null, 2));

	// Create the form
	const deletePatientForm = await superValidate({ patientId }, zod(deletePatientSchema));

	return { deletePatientForm, patienExamsData, countTotal: countTotal[0].count };
};
