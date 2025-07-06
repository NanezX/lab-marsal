import { db } from '$lib/server/db';
// import { examType, exam as examTable, examTypeClassification } from '$lib/server/db/schema';
import { examType, examTypeClassification } from '$lib/server/db/schema';
import { and, asc, count, eq, ilike } from 'drizzle-orm';

export const load = async ({ url }) => {
	let limit = Number(url.searchParams.get('limit') || 6);
	const skip = Number(url.searchParams.get('skip') || 0);
	const name = url.searchParams.get('name');

	if (limit > 25) {
		limit = 25;
	}

	const { count: countTotal, data: examTypesData } = await db.transaction(async (tx) => {
		// Save all the where clauses in an array
		const whereClauses = [eq(examType.deleted, false)];

		const countTotalQuery = tx.select({ count: count() }).from(examType).$dynamic();
		const examTypesQuery = tx
			.select({
				id: examType.id,
				name: examType.name,
				description: examType.description,
				basePrice: examType.basePrice,
				categories: examType.categories,
				createdAt: examType.createdAt,
				updatedAt: examType.updatedAt,
				// examCount: count(examTable.id).as('exam_count'),
				clasification: examTypeClassification.name
			})
			.from(examType)
			// .leftJoin(examTable, eq(examTable.examTypeId, examType.id))
			.innerJoin(examTypeClassification, eq(examType.classificationId, examTypeClassification.id))
			.groupBy(examType.id, examTypeClassification.name)
			.orderBy(asc(examType.name))
			.limit(limit)
			.offset(skip)
			.$dynamic();

		if (name) {
			whereClauses.push(ilike(examType.name, `%${name}%`));
		}

		// where filters
		const where = and(...whereClauses);

		return { count: await countTotalQuery.where(where), data: await examTypesQuery.where(where) };
	});

	return { examTypesData, countTotal: countTotal[0].count };
};
