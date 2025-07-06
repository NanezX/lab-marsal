import puppeteer from 'puppeteer';

export async function POST({ request }) {
	const { pages }: { pages: string[] } = await request.json();
	const baseUrl = new URL(request.url).origin;
	const cssUrl = `${baseUrl}/pdf.css`;

	const browser = await puppeteer.launch({
		headless: true,
		args: ['--no-sandbox', '--disable-setuid-sandbox']
	});

	const page = await browser.newPage();

	// Generate a single HTML document with page breaks
	const fullHtml = `
        <!DOCTYPE html>
        <html>
            <head>
                <meta charset="UTF-8">
                <link rel="stylesheet" href="${cssUrl}" />
                <style>
                    .page {
                        page-break-after: always;
                        height: 100%;
                    }
                    .page:last-child {
                        page-break-after: auto;
                    }
                </style>
            </head>
            <body>
                ${pages
									.map(
										(html) => `
                    <div class="page">
                        ${html.replace(`src="/favicon.png"`, `src="${baseUrl}/favicon.png"`)}
                    </div>
                `
									)
									.join('')}
            </body>
        </html>
    `;

	await page.setContent(fullHtml, {
		waitUntil: 'networkidle0'
	});

	const pdf = await page.pdf({
		format: 'A4',
		printBackground: true,
		margin: { top: '20px', right: '20px', bottom: '20px', left: '20px' },
		preferCSSPageSize: true,
		displayHeaderFooter: false
	});

	await browser.close();

	return new Response(pdf, {
		headers: {
			'Content-Type': 'application/pdf',
			'Content-Disposition': 'attachment; filename="document.pdf"'
		}
	});
}
