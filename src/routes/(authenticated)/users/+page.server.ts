import { db } from '$lib/server/db';
import { user as userTable } from '$lib/server/db/schema';
import { normalized } from '$lib/shared/utils.js';
import { and, or, ilike, eq, count, asc, desc, sql, type SQL } from 'drizzle-orm';

export const load = async ({ url }) => {
	let limit = Number(url.searchParams.get('limit') || 12);
	const skip = Number(url.searchParams.get('skip') || 0);
	if (limit > 25) limit = 25;

	const searchText = url.searchParams.get('search')?.trim();
	const order = url.searchParams.get('orderBy') || 'name'; // 'documentId' or 'name' or 'email'
	const direction = url.searchParams.get('orderDirection') || 'asc'; // 'asc' or 'desc'

	const deletedFilter = url.searchParams.get('deleted'); // 'deleted', 'all', or null
	// deletedFilter: undefined (default) -> only non-deleted
	// deletedFilter: 'deleted' -> only deleted
	// deletedFilter: 'all' -> no filter

	const { count: countTotal, data: usersData } = await db.transaction(async (tx) => {
		// Common filters
		const whereClauses = [];

		// Handle deleted filter
		if (deletedFilter === 'deleted') {
			whereClauses.push(eq(userTable.deleted, true));
		} else if (deletedFilter !== 'all') {
			whereClauses.push(eq(userTable.deleted, false));
		}

		// Unified search logic
		if (searchText) {
			const normalizedSearch = normalized(searchText).replace(/\s+/g, ' ').trim();

			if (/^\d+$/.test(normalizedSearch)) {
				// Search by document ID
				whereClauses.push(
					ilike(sql`CAST(${userTable.documentId} AS TEXT)`, `${normalizedSearch}%`)
				);
			} else {
				// Match full name in both directions
				whereClauses.push(
					or(
						ilike(
							sql`(${userTable.firstNameNormalized} || ' ' || ${userTable.lastNameNormalized})`,
							`%${normalizedSearch}%`
						),
						ilike(
							sql`(${userTable.lastNameNormalized} || ' ' || ${userTable.firstNameNormalized})`,
							`%${normalizedSearch}%`
						)
					) as SQL<unknown> // Type assertion to avoid type errors (weird inference issue)
				);
			}
		}

		const where = and(...whereClauses);

		// Count query
		const countTotalQuery = tx.select({ count: count() }).from(userTable).where(where);

		// Determine order
		let orderExpr;
		if (order === 'name') {
			orderExpr = [
				direction === 'desc' ? desc(userTable.firstName) : asc(userTable.firstName),
				direction === 'desc' ? desc(userTable.lastName) : asc(userTable.lastName)
			];
		} else if (order === 'documentId') {
			orderExpr = direction === 'desc' ? desc(userTable.documentId) : asc(userTable.documentId);
		} else {
			// email
			orderExpr = direction === 'desc' ? desc(userTable.email) : asc(userTable.email);
		}

		const patientQuery = tx
			.select({
				id: userTable.id,
				firstName: userTable.firstName,
				lastName: userTable.lastName,
				documentId: userTable.documentId,
				email: userTable.email,
				role: userTable.role,
				createdAt: userTable.createdAt
			})
			.from(userTable)
			.where(where)
			.orderBy(...(Array.isArray(orderExpr) ? orderExpr : [orderExpr]))
			.limit(limit)
			.offset(skip);

		return {
			count: await countTotalQuery,
			data: await patientQuery
		};
	});

	return {
		usersData,
		countTotal: countTotal[0].count
	};
};
