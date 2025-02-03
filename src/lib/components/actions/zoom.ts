export type ZoomArgs = {
	scale?: number;
	time?: number;
	zindexIn?: string;
	zindexOut?: string;
};
export function zoom(node: HTMLElement, args: ZoomArgs = {}) {
	const { scale = 1.025, time = 0.5, zindexIn, zindexOut = "auto" } = args;

	node.style.transition = `${time}s`;

	function zoomIn() {
		node.style.transform = `scale(${scale})`;
		if (zindexIn) {
			node.style.zIndex = zindexIn
		}
	}
	function zoomOut() {
		if (zindexOut) {
			node.style.zIndex = zindexOut
		}

		node.style.transform = 'scale(1)';
	}
	node.addEventListener('mouseenter', zoomIn);
	node.addEventListener('mouseleave', zoomOut);

	return {
		destroy() {
			node.removeEventListener('mouseenter', zoomIn);
			node.removeEventListener('mouseleave', zoomOut);
		}
	};
}
