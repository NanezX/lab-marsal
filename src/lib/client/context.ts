import { getContext, setContext } from 'svelte';
import type { LayoutData } from '../../routes/(authenticated)/$types';

const key = 'user-data-context';

export function setUserContext(user: LayoutData['user']) {
	setContext(key, user);
}

export function getUserContext() {
	return getContext(key) as LayoutData['user'];
}
