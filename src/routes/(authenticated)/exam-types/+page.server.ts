import { db } from '$lib/server/db';
import { examType } from '$lib/server/db/schema';
import { asc, count, ilike } from 'drizzle-orm';

export const load = async ({ url }) => {
	let limit = Number(url.searchParams.get('limit') || 5);
	const skip = Number(url.searchParams.get('skip') || 0);
	const name = url.searchParams.get('name');

	console.log('name: ', name);
	console.log('name.len: ', name?.length);

	if (limit > 25) {
		limit = 25;
	}

	let countTotalQuery = db.select({ count: count() }).from(examType).$dynamic();
	let examTypesQuery = db
		.select()
		.from(examType)
		.orderBy(asc(examType.name))
		.limit(limit)
		.offset(skip)
		.$dynamic();

	if (name) {
		countTotalQuery = countTotalQuery.where(ilike(examType.name, `%${name}%`));
		examTypesQuery = examTypesQuery.where(ilike(examType.name, `%${name}%`));
	}

	// const countTotal = await db.select({ count: count() }).from(examType);
	// const examTypesData = await db.select().from(examType).orderBy(asc(examType.name)).limit(limit).offset(skip)
	const countTotal = await countTotalQuery;
	const examTypesData = await examTypesQuery;
	console.log(countTotal);

	return { examTypesData, countTotal: countTotal[0].count };
};
