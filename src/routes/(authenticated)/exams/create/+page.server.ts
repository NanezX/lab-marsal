import { createExamSchema } from '$lib/server/utils/zod';
import { superValidate, fail as failForms } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import type { Actions } from './$types';
import { setFlash } from 'sveltekit-flash-message/server';

export const load = async () => {
	const createExamForm = await superValidate(zod(createExamSchema));

	return { createExamForm };
};

export const actions: Actions = {
	default: async (event) => {
		const request = event.request;
		const form = await superValidate(request, zod(createExamSchema));

		console.log('form.data: ', form.data);

		if (!form.valid) {
			console.error(JSON.stringify(form.errors, null, 2));
			// Again, return { form } and things will just work.
			return failForms(400, { form });
		}

		setFlash({ type: 'success', message: 'Testing this shit' }, event.cookies);
	}
};
