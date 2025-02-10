import RecoveryUserTemplate from '$lib/components/emails/RecoveryUserTemplate.svelte';
import RegisteredUserTemplate from '$lib/components/emails/RegisteredUserTemplate.svelte';
import type { ComponentProps } from 'svelte';
import { render } from 'svelte/server';

export function renderRegisteredUser(props: ComponentProps<typeof RegisteredUserTemplate>) {
	const { head, body } = render(RegisteredUserTemplate, {
		props
	});
	return { head, body };
}

export function renderRecoveryUser(props: ComponentProps<typeof RecoveryUserTemplate>) {
	const { head, body } = render(RecoveryUserTemplate, {
		props
	});
	return { head, body };
}
