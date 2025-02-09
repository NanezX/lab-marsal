import { db } from '$lib/server/db';
import { user } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import type { PgTable } from 'drizzle-orm/pg-core';


// USERS

export async function findUserByEmail(email: string, options = {}) {
	console.log("options: ", options)

	const results = await db
		.select(selectWithout(user, ["deleted", "passwordHash"]))
		.from(user)
		.where(eq(user.email, email.toLowerCase()));

	return results.at(0)
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
	) as Omit<T["_"]["columns"], K>; // 🔥 Correctly removes excluded columns from the type
}






