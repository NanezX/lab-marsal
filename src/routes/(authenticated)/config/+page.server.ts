import { superValidate, fail as failForms } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { EditConfigSchema } from '$lib/server/utils/zod';
import { toSnakeCase } from 'drizzle-orm/casing';
import { db } from '$lib/server/db';
import { config as configTable } from '$lib/server/db/schema';
import postgres from 'postgres';
import { redirect } from 'sveltekit-flash-message/server';
import { failFormResponse } from '$lib/server/utils/failFormResponse';
import { AppDataNotSavedError } from '$lib/server/error';
import type { Actions } from './$types';
import { getConfigForEdit } from '$lib/server/utils/dbQueries';
import { sql } from 'drizzle-orm';
// TODO: Verify what roles can create an exam type (on the action) - (maybe just block the page to those user in the backend)

export const load = async () => {
	const configurationData = await getConfigForEdit();

	const editConfigForm = await superValidate(configurationData, zod(EditConfigSchema));

	return { configurationData, editConfigForm };
};

export const actions: Actions = {
	default: async (event) => {
		const request = event.request;
		const form = await superValidate(request, zod(EditConfigSchema));

		if (!form.valid) {
			console.error(JSON.stringify(form.errors, null, 2));
			// Again, return { form } and things will just work.
			return failForms(400, { form });
		}

		// const { orgFullName, orgRif, orgAddress, orgPhones, orgEmail } = form.data;
		const configuration = form.data;

		const records = Object.entries(configuration).map(([id, value]) => ({
			id: toSnakeCase(id),
			value
		}));

		console.log('records: ', records);

		try {
			// Insert the records into the database
			// Using 'onConflictDoUpdate' to update existing records
			const res = await db
				.insert(configTable)
				.values(records)
				.onConflictDoUpdate({
					target: configTable.id,
					set: {
						value: sql`excluded.value` // Direct PostgreSQL syntax
					}
				})
				.returning();

			console.log('res: ', res);
		} catch (e) {
			// Default message
			let errMsg = 'No se actualizó la configuración';

			// Print the error type
			if (e instanceof postgres.PostgresError) {
				console.error('PostgresError');
				errMsg = errMsg + ' - PG';
			} else if (e instanceof AppDataNotSavedError) {
				errMsg = e.message;
			} else if (e instanceof Error) {
				console.error('Unknown error');
			}

			// Print the error
			console.error(e);

			return failFormResponse(form, errMsg, event.cookies, 500);
		}

		redirect('/home', { type: 'success', message: 'Configuración actualizada' }, event.cookies);
	}
};
