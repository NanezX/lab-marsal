import { db } from '$lib/server/db';
import { examType } from '$lib/server/db/schema';
import { asc, count, eq, ilike } from 'drizzle-orm';

export const load = async ({ url }) => {
	let limit = Number(url.searchParams.get('limit') || 5);
	const skip = Number(url.searchParams.get('skip') || 0);
	const name = url.searchParams.get('name');

	if (limit > 25) {
		limit = 25;
	}

	const { count: countTotal, data: examTypesData } = await db.transaction(async (tx) => {
		let countTotalQuery = tx.select({ count: count() }).from(examType).$dynamic();
		let examTypesQuery = tx
			.select()
			.from(examType)
			.orderBy(asc(examType.name))
			.limit(limit)
			.offset(skip)
			.where(eq(examType.deleted, false))
			.$dynamic();

		if (name) {
			countTotalQuery = countTotalQuery.where(ilike(examType.name, `%${name}%`));
			examTypesQuery = examTypesQuery.where(ilike(examType.name, `%${name}%`));
		}

		return { count: await countTotalQuery, data: await examTypesQuery };
	});

	return { examTypesData, countTotal: countTotal[0].count };
};
