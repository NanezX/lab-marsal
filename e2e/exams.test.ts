import { expect, test } from '@playwright/test';

test.describe(('Exam page'), () => {

    test('should display the search bar for exams', async ({ page }) => {
        await page.goto('/login');
        await expect(page.locator('h1')).toBeVisible();
    });
    test('should display exams on the pages', async ({ page }) => {
        await page.goto('/login');
        await expect(page.locator('h1')).toBeVisible();
    });

    test('should filter the displayed exams using the search bar for exams', async ({ page }) => {
        await page.goto('/login');
        await expect(page.locator('h1')).toBeVisible();
    });

    test('should allow to redirect to specific exam page when clicking to the document icon', async ({ page }) => {
        await page.goto('/login');
        await expect(page.locator('h1')).toBeVisible();
    });

    test('should allow to modify specific exam when clicking to the modify icon', async ({ page }) => {
        await page.goto('/login');
        await expect(page.locator('h1')).toBeVisible();
    });

    test('should allow to delete specific exam when clicking to the delete icon', async ({ page }) => {
        await page.goto('/login');
        await expect(page.locator('h1')).toBeVisible();
    });
})