import { test, expect } from '@playwright/test';

test.describe('Consent Banner and Cookies Management', () => {
  test('should display the consent banner on first load', async ({ page }) => {
    await page.goto('/');
    
    const banner = page.locator('#consent-banner');
    await expect(banner).toBeVisible();
  });

  test('should hide banner and save state to localStorage on accept all', async ({ page }) => {
    await page.goto('/');
    
    const banner = page.locator('#consent-banner');
    const acceptBtn = page.locator('#consent-accept');
    
    await expect(banner).toBeVisible();
    await acceptBtn.click();
    
    await expect(banner).not.toBeVisible();
    
    const consentValue = await page.evaluate(() => localStorage.getItem('dougdesign-consent-v1'));
    const commentsConsentValue = await page.evaluate(() => localStorage.getItem('dougdesign-comments-consent-v1'));
    
    expect(consentValue).toBe('accepted');
    expect(commentsConsentValue).toBe('comments-accepted');
  });

  test('should hide banner and save state to localStorage on reject all', async ({ page }) => {
    await page.goto('/');
    
    const banner = page.locator('#consent-banner');
    const rejectBtn = page.locator('#consent-reject');
    
    await expect(banner).toBeVisible();
    await rejectBtn.click();
    
    await expect(banner).not.toBeVisible();
    
    const consentValue = await page.evaluate(() => localStorage.getItem('dougdesign-consent-v1'));
    const commentsConsentValue = await page.evaluate(() => localStorage.getItem('dougdesign-comments-consent-v1'));
    
    expect(consentValue).toBe('rejected');
    expect(commentsConsentValue).toBe('comments-rejected');
  });
});
