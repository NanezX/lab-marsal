import { db } from '$lib/server/db';
import { exam as examTable } from '$lib/server/db/schema';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { deletePatientSchema } from '$lib/server/utils/zod';
import type { PageServerLoad } from './$types';
import { count, eq, and } from 'drizzle-orm';

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

		const patientExams = await tx.query.exam.findMany({
			limit,
			offset: skip,
			where: whereFilter,
			orderBy: (examTable, { desc }) => [desc(examTable.createdAt)],
			columns: {
				id: true,
				createdAt: true,
				priority: true,
				status: true,
				deliveredAt: true,
				paid: true
			},
			with: {
				examType: {
					columns: { name: true }
				}
			}
		});

		return { count: countTotal, data: patientExams };
	});

	// Create the form for deleting (if desired)
	const deletePatientForm = await superValidate({ patientId }, zod(deletePatientSchema));

	return { deletePatientForm, patienExamsData, countTotal: countTotal[0].count };
};
