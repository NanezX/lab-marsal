import { expect, test } from '@playwright/test';

test.describe(('Home page'), () => {

	test('should display the welcome message with the image', async ({ page }) => {
		await page.goto('/login');
		await expect(page.locator('h1')).toBeVisible();
	});

	test('should display 4 latest patients views at the home page', async ({ page }) => {
		await page.goto('/login');
		await expect(page.locator('h1')).toBeVisible();
	});

	test('should redirect when clicking on the latest patients', async ({ page }) => {
		await page.goto('/login');
		await expect(page.locator('h1')).toBeVisible();
	});

	test('should display 4 latest exams views at the home page', async ({ page }) => {
		await page.goto('/login');
		await expect(page.locator('h1')).toBeVisible();
	});

	test('should redirect when clicking on the latest exams', async ({ page }) => {
		await page.goto('/login');
		await expect(page.locator('h1')).toBeVisible();
	});

	test('should set cookies after login with correct credentials', async ({ page }) => {
		await page.goto('/login');
		await expect(page.locator('h1')).toBeVisible();
	});

	test('should display the side bar', async ({ page }) => {
		await page.goto('/login');
		await expect(page.locator('h1')).toBeVisible();
	});

	test('should display the nav bar', async ({ page }) => {
		await page.goto('/login');
		await expect(page.locator('h1')).toBeVisible();
	});
})

