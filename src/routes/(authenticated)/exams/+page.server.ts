import { db } from '$lib/server/db';
import { exam, examType, patient } from '$lib/server/db/schema';
import { normalized } from '$lib/shared/utils.js';
import { and, or, ilike, eq, count, asc, desc, sql, type SQL } from 'drizzle-orm';

export const load = async ({ url }) => {
	let limit = Number(url.searchParams.get('limit') || 12);
	const skip = Number(url.searchParams.get('skip') || 0);

	const searchText = url.searchParams.get('search')?.trim();
	const order = url.searchParams.get('orderBy') || 'updatedAt'; // or 'patientName' or 'examTypeName'
	const direction = url.searchParams.get('orderDirection') || 'desc'; // 'asc' or 'desc'

	if (limit > 25) limit = 25;

	const { count: countTotal, data: examsData } = await db.transaction(async (tx) => {
		const whereClauses = [];

		if (searchText) {
			const normalizedSearch = normalized(searchText).replace(/\s+/g, ' ').trim();

			if (/^\d+$/.test(normalizedSearch)) {
				// Assume it's a document ID
				whereClauses.push(ilike(sql`CAST(${patient.documentId} AS TEXT)`, `${normalizedSearch}%`));
			} else {
				whereClauses.push(
					or(
						// Search by patient name (first + last)
						ilike(
							sql`(${patient.firstNameNormalized} || ' ' || ${patient.lastNameNormalized})`,
							`%${normalizedSearch}%`
						),
						ilike(
							sql`(${patient.lastNameNormalized} || ' ' || ${patient.firstNameNormalized})`,
							`%${normalizedSearch}%`
						),
						// Search by exam type name
						ilike(examType.nameNormalized, `%${normalizedSearch}%`)
					) as SQL<unknown>
				);
			}
		}

		const where = and(...whereClauses);

		// Count query
		const countTotalQuery = tx
			.select({ count: count() })
			.from(exam)
			.leftJoin(patient, eq(patient.id, exam.patientId))
			.leftJoin(examType, eq(examType.id, exam.examTypeId))
			.where(where);

		// Sorting
		let orderExpr;
		if (order === 'patientName') {
			orderExpr = [
				direction === 'desc' ? desc(patient.firstName) : asc(patient.firstName),
				direction === 'desc' ? desc(patient.lastName) : asc(patient.lastName)
			];
		} else if (order === 'examTypeName') {
			orderExpr = direction === 'desc' ? desc(examType.name) : asc(examType.name);
		} else {
			orderExpr = direction === 'desc' ? desc(exam.updatedAt) : asc(exam.updatedAt);
		}

		const examsQuery = tx
			.select({
				id: exam.id,
				customTag: exam.customTag,
				priority: exam.priority,
				status: exam.status,
				paid: exam.paid,
				updatedAt: exam.updatedAt,
				pricePaid: exam.pricePaid,
				patientName: sql<string>`${patient.firstName} || ' ' || ${patient.lastName}`.as('patientName'),
				patientDocumentId: patient.documentId,
				examTypeName: examType.name
			})
			.from(exam)
			.innerJoin(patient, eq(patient.id, exam.patientId))
			.innerJoin(examType, eq(examType.id, exam.examTypeId))
			.where(where)
			.orderBy(...(Array.isArray(orderExpr) ? orderExpr : [orderExpr]))
			.limit(limit)
			.offset(skip);

		return {
			count: await countTotalQuery,
			data: await examsQuery
		};
	});

	const data_end = {
		examsData,
		countTotal: countTotal[0].count
	};

	console.log('data_end: ', data_end);

	return data_end;
};
