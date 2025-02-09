import VerifyAccountTemplate from '$lib/components/emails/VerifyAccountTemplate.svelte';
import { render } from 'svelte/server';

export function renderVerifyAccount(name: string) {
	const { head, body } = render(VerifyAccountTemplate, { props: { name } });
	return { head, body };
}
