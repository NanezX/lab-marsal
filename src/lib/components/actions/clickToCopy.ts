import { toastSuccess, toastError } from '$lib/toasts';

export function clickToCopy(node: HTMLElement, text: string) {
	async function copyText() {
		try {
			if (navigator.clipboard) {
				await navigator.clipboard.writeText(text);
			} else {
				// NOTE: This is a fallback for browsers that doesn't support
				// the Clipboard API like localhost or HTTP sites (not HTTPS)
				const textArea = document.createElement('textarea');
				textArea.value = text;
				document.body.appendChild(textArea);
				textArea.focus();
				textArea.select();
				document.execCommand('copy');
				document.body.removeChild(textArea);
			}

			node.dispatchEvent(
				new CustomEvent('copysuccess', {
					bubbles: true
				})
			);

			toastSuccess(`Valor copiado: ${text}`);
		} catch (error) {
			node.dispatchEvent(
				new CustomEvent('copyerror', {
					bubbles: true,
					detail: error
				})
			);

			console.error(error);
			toastError('Fallo al copiar el valor');
		}
	}

	node.addEventListener('click', copyText);

	return {
		destroy() {
			node.removeEventListener('click', copyText);
		}
	};
}
