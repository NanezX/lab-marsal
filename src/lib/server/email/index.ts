import { env } from '$env/dynamic/private';
import nodemailer from 'nodemailer';

// Create a reusable transporter
export const transporter = nodemailer.createTransport(
	{
		host: env.SMTP_HOST,
		port: Number(env.SMTP_PORT) || 587, // Default to 587 if not set
		secure: env.SMTP_SECURE === 'true',
		auth: {
			user: env.SMTP_USER,
			pass: env.SMTP_PASS
		}
	},
	{ from: `"Laboratorio Marsal" <${env.SMTP_USER}>` }
);

/**
 * Sends an email using the reusable transporter.
 * @param {string} to - Recipient email.
 * @param {string} subject - Email subject.
 * @param {string} text - Plain text version.
 * @param {string} html - HTML version.
 * @returns {Promise<string>} - Message ID if successful.
 */
export async function sendEmail(
	to: string,
	subject: string,
	text: string,
	html: string
): Promise<string> {
	try {
		const info = await transporter.sendMail({
			// from: `"Your App" <${env.SMTP_USER}>`,
			to,
			subject,
			text,
			html
		});

		console.log('Email sent:', info.messageId);
		return info.messageId;
	} catch (error) {
		console.error('Error sending email:', error);
		throw new Error('Failed to send email.');
	}
}
