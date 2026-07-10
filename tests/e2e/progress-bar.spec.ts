import { test, expect } from '@playwright/test';

test.describe('Reading Progress Bar functionality', () => {
  test('should render and update progress bar on scroll', async ({ page }) => {
    // Set a small viewport to guarantee the content is scrollable
    await page.setViewportSize({ width: 1280, height: 600 });

    // Navigate to a known long post
    await page.goto('/como-se-proteger-de-prompt-injection-ia', { waitUntil: 'networkidle' });

    const progressBar = page.locator('#reading-progress-bar');
    await expect(progressBar).toBeAttached();

    // Verify initial state
    const initialWidth = await progressBar.getAttribute('style');
    expect(initialWidth).toContain('width: 0%');

    // Print dimensions before and after scrolling
    const dimensionsBefore = await page.evaluate(() => {
      return {
        scrollHeight: document.documentElement.scrollHeight,
        innerHeight: window.innerHeight,
        scrollY: window.scrollY
      };
    });
    console.log('BEFORE SCROLL:', dimensionsBefore);

    // Disable smooth scroll and scroll down significantly
    await page.evaluate(() => {
      document.documentElement.style.scrollBehavior = 'auto';
      window.scrollTo(0, 1000);
      window.dispatchEvent(new Event('scroll'));
    });

    // Wait a short moment
    await page.waitForTimeout(500);

    const dimensionsAfter = await page.evaluate(() => {
      return {
        scrollHeight: document.documentElement.scrollHeight,
        innerHeight: window.innerHeight,
        scrollY: window.scrollY
      };
    });
    console.log('AFTER SCROLL:', dimensionsAfter);

    const scrolledWidth = await progressBar.getAttribute('style');
    expect(scrolledWidth).not.toContain('width: 0%');
  });
});
