// src/routes/api/patients/search/+server.ts
import { db } from '$lib/server/db';
import { patient as patientTable } from '$lib/server/db/schema';
import { eq, ilike, asc, or, sql, type SQL } from 'drizzle-orm';
import { json } from '@sveltejs/kit';
import { normalized } from '$lib/shared/utils';

export async function GET({ url }) {
	const q = url.searchParams.get('q')?.trim();

	if (!q) return json([]);

	const normalizedSearch = normalized(q).replace(/\s+/g, ' ').trim();
	const whereClauses = [eq(patientTable.deleted, false)];

	if (/^\d+$/.test(normalizedSearch)) {
		// Numeric search = documentId
		whereClauses.push(ilike(sql`CAST(${patientTable.documentId} AS TEXT)`, `${normalizedSearch}%`));
	} else {
		// Name + Lastname or Lastname + Name
		whereClauses.push(
			or(
				ilike(
					sql`(${patientTable.firstNameNormalized} || ' ' || ${patientTable.lastNameNormalized})`,
					`%${normalizedSearch}%`
				),
				ilike(
					sql`(${patientTable.lastNameNormalized} || ' ' || ${patientTable.firstNameNormalized})`,
					`%${normalizedSearch}%`
				)
			) as SQL<unknown>
		);
	}

	const where = sql`${sql.join(whereClauses, sql` AND `)}`;

	const results = await db
		.select({
			id: patientTable.id,
			firstName: patientTable.firstName,
			lastName: patientTable.lastName,
			documentId: patientTable.documentId
		})
		.from(patientTable)
		.where(where)
		.orderBy(asc(patientTable.documentId))
		.limit(10);

	return json(results);
}
