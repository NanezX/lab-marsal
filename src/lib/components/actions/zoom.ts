export type ZoomArgs = {
	scale?: number;
	time?: number;
	zindexIn?: number;
	zindexOut?: number;
};
export function zoom(node: HTMLElement, args: ZoomArgs = {}) {
	const { scale = 1.025, time = 0.5, zindexIn, zindexOut } = args;

	node.style.transition = `${time}s`;

	function zoomIn() {
		node.style.transform = `scale(${scale})`;
		if (zindexIn) {
			node.style.zIndex = zindexIn.toString();
		}
	}
	function zoomOut() {
		if (zindexOut) {
			node.style.zIndex = zindexOut.toString();
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
