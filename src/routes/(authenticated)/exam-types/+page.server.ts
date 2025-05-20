import { db } from '$lib/server/db';
import { examType, exam as examTable } from '$lib/server/db/schema';
import { and, asc, count, eq, ilike } from 'drizzle-orm';

export const load = async ({ url }) => {
	let limit = Number(url.searchParams.get('limit') || 5);
	const skip = Number(url.searchParams.get('skip') || 0);
	const name = url.searchParams.get('name');

	if (limit > 25) {
		limit = 25;
	}

	const { count: countTotal, data: examTypesData } = await db.transaction(async (tx) => {
		let countTotalQuery = tx
			.select({ count: count() })
			.from(examType)
			.where(eq(examType.deleted, false))
			.$dynamic();

		let examTypesQuery = tx
			.select({
				id: examType.id,
				name: examType.name,
				description: examType.description,
				basePrice: examType.basePrice,
				categories: examType.categories,
				createdAt: examType.createdAt,
				updatedAt: examType.updatedAt,
				examCount: count(examTable.id).as('exam_count')
			})
			.from(examType)
			.leftJoin(examTable, eq(examTable.examTypeId, examType.id))
			.where(eq(examType.deleted, false))
			.groupBy(examType.id)
			.orderBy(asc(examType.name))
			.limit(limit)
			.offset(skip)
			.$dynamic();

		if (name) {
			countTotalQuery = countTotalQuery.where(
				and(ilike(examType.name, `%${name}%`), eq(examType.deleted, false))
			);
			examTypesQuery = examTypesQuery.where(
				and(ilike(examType.name, `%${name}%`), eq(examType.deleted, false))
			);
		}

		return { count: await countTotalQuery, data: await examTypesQuery };
	});

	return { examTypesData, countTotal: countTotal[0].count };
};
