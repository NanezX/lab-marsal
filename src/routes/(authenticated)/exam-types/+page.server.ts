import { db } from '$lib/server/db';
import { examType } from '$lib/server/db/schema';
import { and, asc, count, eq, ilike } from 'drizzle-orm';

// TODO: Add exams quantity of the given exam type. Use the count() function to count the number of exams for each exam type and add it to the response./
// Try to use the DB transaction to get the count and the exam types in a single query. You can use the `count()` function from drizzle-orm to count the number of exams for each exam type. Use a left join to get the exams for each exam type and group by the exam type ID.
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
			.select()
			.from(examType)
			.orderBy(asc(examType.name))
			.limit(limit)
			.offset(skip)
			.where(eq(examType.deleted, false))
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
