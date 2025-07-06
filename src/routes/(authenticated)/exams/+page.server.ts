import { db } from '$lib/server/db';
import { order, orderExamTypes, examType, patient, exam } from '$lib/server/db/schema';
import { normalized } from '$lib/shared/utils.js';
import { and, or, ilike, eq, count, asc, desc, sql, type SQL } from 'drizzle-orm';
// import { relations } from 'drizzle-orm';

export const load = async ({ url }) => {
	let limit = Number(url.searchParams.get('limit') || 12);
	const skip = Number(url.searchParams.get('skip') || 0);

	const searchText = url.searchParams.get('search')?.trim();
	const orderBy = url.searchParams.get('orderBy') || 'updatedAt';
	const direction = url.searchParams.get('orderDirection') || 'desc';

	if (limit > 25) limit = 25;

	const { count: countTotal, data: ordersData } = await db.transaction(async (tx) => {
		const whereClauses = [eq(order.deleted, false)];

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
						// Search by exam type names through orderExamTypes
						ilike(
							sql`(SELECT string_agg(${examType.nameNormalized}, ', ') 
                  FROM ${orderExamTypes} 
                  JOIN ${examType} ON ${examType.id} = ${orderExamTypes.examTypeId}
                  WHERE ${orderExamTypes.orderId} = ${order.id})`,
							`%${normalizedSearch}%`
						)
					) as SQL<unknown>
				);
			}
		}

		const where = and(...whereClauses);

		// Count query
		const countTotalQuery = tx
			.select({ count: count() })
			.from(order)
			.leftJoin(patient, eq(patient.id, order.patientId))
			.where(where);

		// Sorting
		let orderExpr;
		if (orderBy === 'patientName') {
			orderExpr = [
				direction === 'desc' ? desc(patient.firstName) : asc(patient.firstName),
				direction === 'desc' ? desc(patient.lastName) : asc(patient.lastName)
			];
		} else if (orderBy === 'documentId') {
			orderExpr = direction === 'desc' ? desc(patient.documentId) : asc(patient.documentId);
		} else if (orderBy === 'examTypeName') {
			orderExpr =
				direction === 'desc'
					? desc(sql`(SELECT string_agg(${examType.name}, ', ') 
                   FROM ${orderExamTypes} 
                   JOIN ${examType} ON ${examType.id} = ${orderExamTypes.examTypeId}
                   WHERE ${orderExamTypes.orderId} = ${order.id})`)
					: asc(sql`(SELECT string_agg(${examType.name}, ', ') 
                  FROM ${orderExamTypes} 
                  JOIN ${examType} ON ${examType.id} = ${orderExamTypes.examTypeId}
                  WHERE ${orderExamTypes.orderId} = ${order.id})`);
		} else {
			orderExpr = direction === 'desc' ? desc(order.updatedAt) : asc(order.updatedAt);
		}

		// Main query
		const ordersQuery = tx
			.select({
				id: order.id,
				priority: order.priority,
				paid: order.paid,
				updatedAt: order.updatedAt,
				totalPrice: order.totalPrice,
				pricePaid: order.pricePaid,
				deliveredAt: order.deliveredAt,
				patientName: sql<string>`${patient.firstName} || ' ' || ${patient.lastName}`.as(
					'patientName'
				),
				patientDocumentId: patient.documentId,
				examTypeNames: sql<string>`(
          SELECT string_agg(${examType.name}, ', ') 
          FROM ${orderExamTypes} 
          JOIN ${examType} ON ${examType.id} = ${orderExamTypes.examTypeId}
          WHERE ${orderExamTypes.orderId} = ${order.id}
        )`.as('examTypeNames'),
				examCount: sql<number>`(
          SELECT COUNT(*) FROM ${exam} WHERE ${exam.orderId} = ${order.id}
        )`.as('examCount')
			})
			.from(order)
			.innerJoin(patient, eq(patient.id, order.patientId))
			.where(where)
			.orderBy(...(Array.isArray(orderExpr) ? orderExpr : [orderExpr]))
			.limit(limit)
			.offset(skip);

		return {
			count: await countTotalQuery,
			data: await ordersQuery
		};
	});

	console.log('AverL ', {
		ordersData,
		countTotal: countTotal[0].count
	});

	return {
		ordersData,
		countTotal: countTotal[0].count
	};
};
