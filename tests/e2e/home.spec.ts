import { test, expect } from '@playwright/test';

test.describe('Home Page functionality', () => {
  test('should load the homepage successfully and display title', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Doug Design/);
  });

  test('should toggle theme when theme-toggle button is clicked', async ({ page }) => {
    await page.goto('/');
    
    // Check initial state (should not have class 'dark' on html element unless system preferences mandate it)
    const htmlElement = page.locator('html');
    
    const themeButton = page.locator('#theme-toggle');
    await expect(themeButton).toBeVisible();

    // Toggle the theme
    await themeButton.click();
    
    // Check localStorage key
    const themeValue = await page.evaluate(() => localStorage.getItem('theme'));
    expect(themeValue).not.toBeNull();
  });
});
