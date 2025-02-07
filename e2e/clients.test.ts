import { expect, test } from '@playwright/test';

test.describe('Client page', () => {
	test('should display the search bar for clients', async ({ page }) => {
		await page.goto('/login');
		await expect(page.locator('h1')).toBeVisible();
	});
	test('should display client on the page', async ({ page }) => {
		await page.goto('/login');
		await expect(page.locator('h1')).toBeVisible();
	});

	test('should filter the displayed client using the search bar for clients', async ({ page }) => {
		await page.goto('/login');
		await expect(page.locator('h1')).toBeVisible();
	});

	test('should allow to redirect to specific client page when clicking to the client icon', async ({
		page
	}) => {
		await page.goto('/login');
		await expect(page.locator('h1')).toBeVisible();
	});

	test('should allow to modify specific client exam when clicking to the modify icon', async ({
		page
	}) => {
		await page.goto('/login');
		await expect(page.locator('h1')).toBeVisible();
	});

	test('should allow to delete specific client when clicking to the delete icon', async ({
		page
	}) => {
		await page.goto('/login');
		await expect(page.locator('h1')).toBeVisible();
	});
});
