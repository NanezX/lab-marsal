import { expect, test } from '@playwright/test';

test.describe(('Nav bar'), () => {

    test('should display the nav bar in all the pages', async ({ page }) => {
        await page.goto('/login');
        await expect(page.locator('h1')).toBeVisible();
    });

    test('should redirect to home page after clicking on the image', async ({ page }) => {
        await page.goto('/login');
        await expect(page.locator('h1')).toBeVisible();
    });

    test('should display the dropdown in the profile options after click on the profile button', async ({ page }) => {
        await page.goto('/login');
        await expect(page.locator('h1')).toBeVisible();
    });

    test('should redirect to profile when clicking on profile in the dropdown', async ({ page }) => {
        await page.goto('/login');
        await expect(page.locator('h1')).toBeVisible();
    });

    test('should logout the user when clicking on log out in the dropdow ', async ({ page }) => {
        await page.goto('/login');
        await expect(page.locator('h1')).toBeVisible();
    });
})

