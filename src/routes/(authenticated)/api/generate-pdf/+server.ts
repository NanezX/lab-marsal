import puppeteer from 'puppeteer';

export async function POST({ request }) {
	const { html, styles } = await request.json();

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
        <script src="https://cdn.tailwindcss.com"></script>
        <style>${styles}</style>
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
