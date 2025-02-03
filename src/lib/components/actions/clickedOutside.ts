import type { ActionReturn } from 'svelte/action';

interface Attributes {
	onclickedout: () => void;
}

export function clickedOutside(node: HTMLElement): ActionReturn<undefined, Attributes> {
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
}
