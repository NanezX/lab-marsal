import { toastError } from '$lib/toasts';

export async function generatePDF(element_: HTMLElement | null) {
	if (element_ === null) {
		toastError('No hay nada seleccionado para generar el PDF');
		return;
	}

	const response = await fetch('/api/generate-pdf', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({
			html: element_.outerHTML
		})
	});

	if (!response.ok) {
		toastError('Fallo la generación del PDF ');
		return;
	}

	const blob = await response.blob();
	const url = URL.createObjectURL(blob);

	const a = document.createElement('a');
	a.href = url;
	a.download = 'document.pdf';
	a.click();

	URL.revokeObjectURL(url);
}
