import { toastError, toastLoading, toastSuccess } from '$lib/toasts';
import { toast } from '@zerodevx/svelte-toast';

export async function generatePDF(elements_: HTMLElement[] | null) {
	const loadingToast = toastLoading('Generando documento...');

	if (elements_ === null) {
		toast.pop(loadingToast);
		toastError('No hay nada seleccionado para generar el PDF');
		return false;
	}

	const response = await fetch('/api/generate-pdf', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({
			pages: elements_.map((el) => el.outerHTML)
		})
	});

	if (!response.ok) {
		toast.pop(loadingToast);
		toastError('Fallo la generación del PDF ');
		return false;
	}

	const blob = await response.blob();
	const url = URL.createObjectURL(blob);

	const a = document.createElement('a');
	a.href = url;
	a.download = 'document.pdf';
	a.click();

	URL.revokeObjectURL(url);

	toast.pop(loadingToast);
	toastSuccess('Documento generado');

	return true;
}

// WIP
export async function printPDF(element_: HTMLElement | null) {
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
	const pdfUrl = URL.createObjectURL(blob);

	// Create an iframe to load the PDF
	const iframe = document.createElement('iframe');
	iframe.style.display = 'none';
	iframe.src = pdfUrl;
	document.body.appendChild(iframe);

	iframe.onload = () => {
		// Wait for PDF to fully load
		setTimeout(() => {
			try {
				// Focus the iframe and trigger print
				iframe.focus();

				iframe.contentWindow?.print();

				// Clean up
				setTimeout(() => {
					document.body.removeChild(iframe);
					URL.revokeObjectURL(pdfUrl);
				}, 1000);
			} catch (error) {
				toastError('Error al abrir el diálogo de impresión');
				console.error('Print error:', error);
				document.body.removeChild(iframe);
				URL.revokeObjectURL(pdfUrl);
			}
		}, 500);
	};
}
