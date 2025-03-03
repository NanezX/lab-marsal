import { db } from '$lib/server/db';
import { examType } from '$lib/server/db/schema';
import { asc, count } from 'drizzle-orm';

export const load = async ({ url }) => {

    // let limit = Number(url.searchParams.get("limit") || 10)
    let limit = Number(url.searchParams.get("limit") || 3)
    const skip = Number(url.searchParams.get("skip") || 0)

    if (limit > 25) {
        limit = 25
    }

    const countTotal = await db.select({ count: count() }).from(examType);
    const examTypesData = await db.select().from(examType).orderBy(asc(examType.name)).limit(limit).offset(skip)
    console.log(countTotal)

    return { examTypesData, countTotal: countTotal[0].count };
};