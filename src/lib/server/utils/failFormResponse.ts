import { fail as failForms, type superValidate } from 'sveltekit-superforms';
import { setFlash } from 'sveltekit-flash-message/server';
import type { Cookies } from '@sveltejs/kit';

export function failFormResponse(
	form: Awaited<ReturnType<typeof superValidate>>,
	message: string,
	cookies: Cookies,
	statusCode = 400
) {
	setFlash({ type: 'error', message: message }, cookies);
	return failForms(statusCode, { form });
}
