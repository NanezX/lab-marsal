import puppeteer from 'puppeteer';

export async function POST({ request }) {
	const { html } = await request.json();

	const baseUrl = new URL(request.url).origin;
	const cssUrl = `${baseUrl}/pdf.css`;

	// Launch browser (use @sparticuz/chromium for serverless)
	const browser = await puppeteer.launch({
		headless: true,
		args: ['--no-sandbox', '--disable-setuid-sandbox']
	});

	const page = await browser.newPage();

	// Inject HTML and CSS
	await page.setContent(
		`
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8">
        <link rel="stylesheet" href="${cssUrl}" />
      </head>
      <body>${html}</body>
    </html>
  `,
		{ waitUntil: 'networkidle0' }
	);

	// Add extra wait for CSS/JS processing
	// await page.waitForTimeout(500); // Allow Tailwind to initialize

	// Generate PDF
	const pdf = await page.pdf({
		format: 'A4',
		printBackground: true,
		margin: { top: '20px', right: '20px', bottom: '20px', left: '20px' },
		preferCSSPageSize: true // Added for better page size handling
	});

	await browser.close();

	// Return PDF
	return new Response(Buffer.from(pdf), {
		headers: {
			'Content-Type': 'application/pdf',
			'Content-Disposition': 'attachment; filename="document.pdf"'
		}
	});
}
