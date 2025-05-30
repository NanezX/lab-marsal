import type { RequestEvent } from './$types';
import { db } from '$lib/server/db';
import { examType } from '$lib/server/db/schema';
import { and, eq, ilike } from 'drizzle-orm';
import { json } from '@sveltejs/kit';

export async function GET({ url }: RequestEvent) {
	const searchTerm = url.searchParams.get('q')?.trim() || '';
	const limit = 10;

	const query = db
		.select({
			id: examType.id,
			name: examType.name
		})
		.from(examType)
		.where(and(ilike(examType.name, `%${searchTerm}%`), eq(examType.deleted, false)))
		.limit(limit);

	const results = await query;

	return json(results);
}
