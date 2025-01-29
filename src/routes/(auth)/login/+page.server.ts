import { UserLoginSchema } from '$lib/utils/zod';
import { fail } from '@sveltejs/kit';
import { message, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';

export const load = async () => {
    const loginForm = await superValidate(zod(UserLoginSchema));

    return { loginForm };
};

export const actions = {
    login: async ({ request }) => {
        const form = await superValidate(request, zod(UserLoginSchema));
        console.log(form);

        console.log(form.data)

        if (!form.valid) {
            // Again, return { form } and things will just work.
            return fail(400, { form });
        }

        // TODO: Do something with the validated form.data

        return message(form, 'Form posted successfully!');
    }
};