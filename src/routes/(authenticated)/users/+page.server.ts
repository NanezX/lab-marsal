import { db } from '$lib/server/db';
import { user as userTable } from '$lib/server/db/schema';
import { UserStatusSchema } from '$lib/server/utils/zod';
import { normalized } from '$lib/shared/utils.js';
import { and, or, ilike, eq, count, asc, desc, sql, type SQL } from 'drizzle-orm';
import { superValidate, fail as failForms } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { failFormResponse } from '$lib/server/utils/failFormResponse';
import { updateUserById } from '$lib/server/utils/dbUpdates.js';
import { redirect } from 'sveltekit-flash-message/server';
import type { Actions } from './$types.js';

export const load = async ({ url }) => {
	let limit = Number(url.searchParams.get('limit') || 12);
	const skip = Number(url.searchParams.get('skip') || 0);
	if (limit > 25) limit = 25;

	const searchText = url.searchParams.get('search')?.trim();
	const order = url.searchParams.get('orderBy') || 'fullName'; // 'documentId' or 'fullName' or 'email'
	const direction = url.searchParams.get('orderDirection') || 'asc'; // 'asc' or 'desc'

	// TODO: When the UI have the filtering for this option, the default should be null
	const deletedFilter = url.searchParams.get('deleted') || 'all'; // 'deleted', 'all', or null
	// deletedFilter: undefined (default) -> only non-deleted
	// deletedFilter: 'deleted' -> only deleted
	// deletedFilter: 'all' -> no filter

	const { count: countTotal, data: usersData } = await db.transaction(async (tx) => {
		// Common filters
		const whereClauses = [];

		// Handle deleted filter
		if (deletedFilter === 'deleted') {
			whereClauses.push(eq(userTable.deleted, true));
		} else if (deletedFilter !== 'all') {
			whereClauses.push(eq(userTable.deleted, false));
		}

		// Unified search logic (name, document ID, or email)
		if (searchText) {
			const normalizedSearch = normalized(searchText).replace(/\s+/g, ' ').trim();

			const searchConditions: SQL<unknown>[] = [];

			if (/^\d+$/.test(normalizedSearch)) {
				// Search by document ID
				searchConditions.push(
					ilike(sql`CAST(${userTable.documentId} AS TEXT)`, `${normalizedSearch}%`)
				);
			} else {
				// Match full name (both directions)
				searchConditions.push(
					ilike(
						sql`(${userTable.firstNameNormalized} || ' ' || ${userTable.lastNameNormalized})`,
						`%${normalizedSearch}%`
					),
					ilike(
						sql`(${userTable.lastNameNormalized} || ' ' || ${userTable.firstNameNormalized})`,
						`%${normalizedSearch}%`
					)
				);
			}

			// Always add email match regardless of numeric
			searchConditions.push(ilike(userTable.email, `%${normalizedSearch}%`));

			whereClauses.push(or(...searchConditions));
		}

		const where = and(...whereClauses);

		// Count query
		const countTotalQuery = tx.select({ count: count() }).from(userTable).where(where);

		// Determine order
		let orderExpr;
		if (order === 'fullName') {
			orderExpr = [
				direction === 'desc' ? desc(userTable.firstName) : asc(userTable.firstName),
				direction === 'desc' ? desc(userTable.lastName) : asc(userTable.lastName)
			];
		} else if (order === 'documentId') {
			orderExpr = direction === 'desc' ? desc(userTable.documentId) : asc(userTable.documentId);
		} else {
			// email
			orderExpr = direction === 'desc' ? desc(userTable.email) : asc(userTable.email);
		}

		const usersQuery = tx
			.select({
				id: userTable.id,
				firstName: userTable.firstName,
				lastName: userTable.lastName,
				documentId: userTable.documentId,
				email: userTable.email,
				role: userTable.role,
				deleted: userTable.deleted
			})
			.from(userTable)
			.where(where)
			.orderBy(...(Array.isArray(orderExpr) ? orderExpr : [orderExpr]))
			.limit(limit)
			.offset(skip);

		return {
			count: await countTotalQuery,
			data: await usersQuery
		};
	});

	// Create the form
	const userStatusForm = await superValidate(zod(UserStatusSchema));

	return {
		userStatusForm,
		usersData,
		countTotal: countTotal[0].count
	};
};

export const actions: Actions = {
	delete: async (event) => {
		const request = event.request;
		const form = await superValidate(request, zod(UserStatusSchema));

		if (!form.valid) {
			console.error(JSON.stringify(form.errors, null, 2));
			// Again, return { form } and things will just work.
			return failForms(400, { form });
		}

		const { id: userId } = form.data;

		// Check if there is an user with this ID
		const foundUser = await db.query.user.findFirst({
			where: (userTable, { eq }) => eq(userTable.id, userId),
			columns: {
				id: true
			}
		});

		if (foundUser === undefined) {
			return failFormResponse(form, 'Usuario no encontrado', event.cookies, 409);
		}

		// updateUserById;
		try {
			// Soft deleting the exam
			await updateUserById(userId, { deleted: true });
		} catch (e) {
			const errMsg = 'No se eliminó el usuario';

			if (e instanceof Error) {
				// Print the error type
				console.error('Unknown error');
			}

			// Print the error
			console.error(e);

			return failFormResponse(form, errMsg, event.cookies, 500);
		}

		// Redirect outside of the try/catch block to the users page with a success message
		redirect('/users', { type: 'success', message: 'Eliminado correctamente' }, event.cookies);
	},
	activate: async (event) => {
		const request = event.request;
		const form = await superValidate(request, zod(UserStatusSchema));

		if (!form.valid) {
			console.error(JSON.stringify(form.errors, null, 2));
			// Again, return { form } and things will just work.
			return failForms(400, { form });
		}

		const { id: userId } = form.data;

		// Check if there is an user with this ID
		const foundUser = await db.query.user.findFirst({
			where: (userTable, { eq }) => eq(userTable.id, userId),
			columns: {
				id: true
			}
		});

		if (foundUser === undefined) {
			return failFormResponse(form, 'Usuario no encontrado', event.cookies, 409);
		}

		try {
			// Soft activating the exam
			await updateUserById(userId, { deleted: false });
		} catch (e) {
			const errMsg = 'No se activo el usuario';

			if (e instanceof Error) {
				// Print the error type
				console.error('Unknown error');
			}

			// Print the error
			console.error(e);

			return failFormResponse(form, errMsg, event.cookies, 500);
		}

		// Redirect outside of the try/catch block to the users page with a success message
		redirect('/users', { type: 'success', message: 'Activado correctamente' }, event.cookies);
	}
};
