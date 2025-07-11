import { db } from '$lib/server/db';
import { order as orderTable, patient as patientTable } from '$lib/server/db/schema';
import { normalized } from '$lib/shared/utils.js';
import { and, or, ilike, eq, count, asc, desc, sql, type SQL } from 'drizzle-orm';

export const load = async ({ url }) => {
	let limit = Number(url.searchParams.get('limit') || 12);
	const skip = Number(url.searchParams.get('skip') || 0);

	const searchText = url.searchParams.get('search')?.trim();
	const order = url.searchParams.get('orderBy') || 'name'; // 'documentId' or 'name'
	const direction = url.searchParams.get('orderDirection') || 'asc'; // 'asc' or 'desc'

	if (limit > 25) limit = 25;

	const { count: countTotal, data: patientsData } = await db.transaction(async (tx) => {
		// Common filters
		const whereClauses = [eq(patientTable.deleted, false)];

		// Unified search logic
		if (searchText) {
			const normalizedSearch = normalized(searchText).replace(/\s+/g, ' ').trim();

			if (/^\d+$/.test(normalizedSearch)) {
				// Search by document ID
				whereClauses.push(
					ilike(sql`CAST(${patientTable.documentId} AS TEXT)`, `${normalizedSearch}%`)
				);
			} else {
				// Match full name in both directions
				whereClauses.push(
					or(
						ilike(
							sql`(${patientTable.firstNameNormalized} || ' ' || ${patientTable.lastNameNormalized})`,
							`%${normalizedSearch}%`
						),
						ilike(
							sql`(${patientTable.lastNameNormalized} || ' ' || ${patientTable.firstNameNormalized})`,
							`%${normalizedSearch}%`
						)
					) as SQL<unknown> // Type assertion to avoid type errors (weird inference issue)
				);
			}
		}

		const where = and(...whereClauses);

		// Count query
		const countTotalQuery = tx.select({ count: count() }).from(patientTable).where(where);

		// Determine order
		let orderExpr;
		if (order === 'name') {
			orderExpr = [
				direction === 'desc' ? desc(patientTable.firstName) : asc(patientTable.firstName),
				direction === 'desc' ? desc(patientTable.lastName) : asc(patientTable.lastName)
			];
		} else {
			orderExpr =
				direction === 'desc' ? desc(patientTable.documentId) : asc(patientTable.documentId);
		}

		const patientQuery = tx
			.select({
				id: patientTable.id,
				firstName: patientTable.firstName,
				lastName: patientTable.lastName,
				documentId: patientTable.documentId,
				createdAt: patientTable.createdAt,
				examCount: count(orderTable.id).as('exam_count')
			})
			.from(patientTable)
			.leftJoin(orderTable, eq(orderTable.patientId, patientTable.id))
			.where(where)
			.groupBy(patientTable.id)
			.orderBy(...(Array.isArray(orderExpr) ? orderExpr : [orderExpr]))
			.limit(limit)
			.offset(skip);

		return {
			count: await countTotalQuery,
			data: await patientQuery
		};
	});

	return {
		patientsData,
		countTotal: countTotal[0].count
	};
};
