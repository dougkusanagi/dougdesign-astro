import { test, expect } from '@playwright/test';

test.describe('Component Documentation Page', () => {
  test('should load the documentation page successfully', async ({ page }) => {
    await page.goto('/docs/components');
    await expect(page).toHaveTitle(/Documentação/);
  });

  test('should render sidebar links and let the user filter components', async ({ page }) => {
    await page.goto('/docs/components');

    const searchInput = page.locator('#component-search');
    await expect(searchInput).toBeVisible();

    const consentLink = page.locator('#components-nav a', { hasText: 'ConsentBanner' });
    await expect(consentLink).toBeVisible();

    // Perform search filter
    await searchInput.fill('AdSense');
    
    // ConsentBanner link should be hidden
    await expect(consentLink).toBeHidden();

    // AdSense link should be visible
    const adsenseLink = page.locator('#components-nav a', { hasText: 'AdSense' });
    await expect(adsenseLink).toBeVisible();
  });
});
