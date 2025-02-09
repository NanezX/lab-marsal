import { db } from '$lib/server/db';
import { user } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import type { InferSelectModel } from 'drizzle-orm';
import type { PgTable } from 'drizzle-orm/pg-core';


/**
 * Find a user by email, with optional column exclusions.
 */
export async function findUserByEmail<
	E extends (keyof InferSelectModel<typeof user>)[]
>(
	email: string,
	...excludes: E
): Promise<Omit<InferSelectModel<typeof user>, E[number]> | undefined> {
	// Perform select operation with exclusion
	const results = await db
		.select(selectWithout(user, excludes))
		.from(user)
		.where(eq(user.email, email.toLowerCase()));

	// Return the result with type
	return results.at(0) as Omit<InferSelectModel<typeof user>, E[number]> | undefined;
}


/**
 * Function to exclude specific columns from a table while keeping full type safety.
 * @param table - Drizzle table schema
 * @param excludedColumns - Array of column names to exclude
 * @returns Select object with only allowed columns
 */
function selectWithout<
	T extends PgTable,
	K extends keyof T["_"]["columns"]
>(table: T, excludedColumns: K[]) {
	return Object.fromEntries(
		Object.entries(table).filter(([key]) => !excludedColumns.includes(key as K))
	) as { [P in Exclude<keyof T["_"]["columns"], K>]: T["_"]["columns"][P] };
}
