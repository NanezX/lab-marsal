import { db } from '$lib/server/db';
import { user } from '$lib/server/db/schema';
import { eq } from 'drizzle-orm';
import type { InferSelectModel } from 'drizzle-orm';
// import type { PgTable } from 'drizzle-orm/pg-core';

export async function updateUserById(
	userId: string,
	values: Partial<Omit<InferSelectModel<typeof user>, 'id' | 'createdAt' | 'updatedAt'>>
) {
	// Update the user database with the values passsed
	await db.update(user).set(values).where(eq(user.id, userId));
}
