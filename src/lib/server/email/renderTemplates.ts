import RegisteredUserTemplate from '$lib/components/emails/RegisteredUserTemplate.svelte';
import type { ComponentProps } from 'svelte';
import { render } from 'svelte/server';

export function renderVerifyAccount(props: ComponentProps<typeof RegisteredUserTemplate>) {
	const { head, body } = render(RegisteredUserTemplate, {
		props
	});
	return { head, body };
}
