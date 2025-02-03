import type { Action } from 'svelte/action';

interface Attributes {
	onclickedout: () => void;
}

export const clickedOutside: Action<HTMLElement, undefined, Attributes> = (node) => {
	const handleClick = (event: MouseEvent) => {
		if (event.target && !node.contains(event.target as Node)) {
			node.dispatchEvent(new CustomEvent('clickedout'));
		}
	};

	document.addEventListener('click', handleClick, true);

	return {
		destroy() {
			document.removeEventListener('click', handleClick, true);
		}
	};
};
