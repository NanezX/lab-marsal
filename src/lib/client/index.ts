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

export function stringMaxLength(str: string, maxLength: number): string {
	if (str.length > maxLength) {
		return str.slice(0, maxLength) + '...';
	}
	return str;
}

export function formatDate(date_: Date) {
	const formatter = new Intl.DateTimeFormat('es-VE', {
		dateStyle: 'medium',
		timeStyle: 'short'
	});

	return formatter.format(date_);
}

export function formatRelativeDate(date_: Date): string {
	const now = new Date();
	const diffMs = now.getTime() - date_.getTime();
	const diffSec = Math.floor(diffMs / 1000);
	const diffMin = Math.floor(diffSec / 60);
	const diffHour = Math.floor(diffMin / 60);
	const diffDay = Math.floor(diffHour / 24);
	const diffWeek = Math.floor(diffDay / 7);

	const rtf = new Intl.RelativeTimeFormat('es-VE', { numeric: 'auto' });

	if (diffSec < 60) {
		return rtf.format(-diffSec, 'second');
	} else if (diffMin < 60) {
		return rtf.format(-diffMin, 'minute');
	} else if (diffHour < 24) {
		return rtf.format(-diffHour, 'hour');
	} else if (diffDay < 7) {
		return rtf.format(-diffDay, 'day');
	} else if (diffWeek < 4) {
		return rtf.format(-diffWeek, 'week');
	}

	// Fallback to full date if older than ~4 weeks
	const formatter = new Intl.DateTimeFormat('es-VE', {
		dateStyle: 'medium',
		timeStyle: 'short'
	});

	return formatter.format(date_);
}

export function getAgeFromDate(birthdate: Date): string {
	const today = new Date();
	let age = today.getFullYear() - birthdate.getFullYear();

	const hasHadBirthdayThisYear =
		today.getMonth() > birthdate.getMonth() ||
		(today.getMonth() === birthdate.getMonth() && today.getDate() >= birthdate.getDate());

	if (!hasHadBirthdayThisYear) {
		age -= 1;
	}

	return age < 1 ? 'Menor de 1 año' : `${age} años`;
}

export * from './enumItems';
