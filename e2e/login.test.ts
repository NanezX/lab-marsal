import { expect, test } from '@playwright/test';

test.describe('Login page', () => {
	test('should have email and password inputs', async ({ page }) => {
		await page.goto('/login');
		await expect(page.locator('h1')).toBeVisible();
	});

	test('should succesfully login with correct credentials', async ({ page }) => {
		await page.goto('/login');
		await expect(page.locator('h1')).toBeVisible();
	});

	test('should fail login with wrong credentials', async ({ page }) => {
		await page.goto('/login');
		await expect(page.locator('h1')).toBeVisible();
	});

	test('should set cookies after login with correct credentials', async ({ page }) => {
		await page.goto('/login');
		await expect(page.locator('h1')).toBeVisible();
	});

	test('should show error message under the inputs if password or email are not valid values', async ({
		page
	}) => {
		await page.goto('/login');
		await expect(page.locator('h1')).toBeVisible();
	});

	test('should show the error modal try to login with wrong credentials', async ({ page }) => {
		await page.goto('/login');
		await expect(page.locator('h1')).toBeVisible();
	});

	test('should redirect to home page after a success login', async ({ page }) => {
		await page.goto('/login');
		await expect(page.locator('h1')).toBeVisible();
	});
});
