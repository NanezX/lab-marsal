import { db } from '$lib/server/db';
import { examType, exam as examTable, patient as patientTable } from '$lib/server/db/schema';
import { and, asc, count, eq, ilike } from 'drizzle-orm';

// TODO: Allow the option to filter by documentId or/and name
// TODO: Allow the option to select the order, by documentId (min to max) or name (alphabetical order)

export const load = async ({ url }) => {
	let limit = Number(url.searchParams.get('limit') || 5);
	const skip = Number(url.searchParams.get('skip') || 0);
	const name = url.searchParams.get('name');

	if (limit > 25) {
		limit = 25;
	}

	const { count: countTotal, data: patientsData } = await db.transaction(async (tx) => {
		let countTotalQuery = tx
			.select({ count: count() })
			.from(patientTable)
			.where(eq(patientTable.deleted, false))
			.$dynamic();

		let patientQuery = tx
			.select({
				id: patientTable.id,
				firstName: patientTable.firstName,
				lastName: patientTable.lastName,
				documentId: patientTable.documentId,
				createdAt: patientTable.createdAt
			})
			.from(patientTable)
			.leftJoin(examTable, eq(examTable.patientId, patientTable.id))
			.where(eq(patientTable.deleted, false))
			.groupBy(patientTable.id)
			.orderBy(asc(patientTable.documentId))
			.limit(limit)
			.offset(skip)
			.$dynamic();

		if (name) {
			const filter = and(ilike(examType.name, `%${name}%`), eq(examType.deleted, false));
			countTotalQuery = countTotalQuery.where(filter);
			patientQuery = patientQuery.where(filter);
		}

		return { count: await countTotalQuery, data: await patientQuery };
	});

	return { patientsData, countTotal: countTotal[0].count };
};
