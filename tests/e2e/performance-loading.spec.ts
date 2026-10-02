import { test, expect } from '@playwright/test';

test('manual ads load near the viewport, independently of consent', async ({ page }) => {
  await page.route('https://www.googletagmanager.com/**', route => route.fulfill({ body: '' }));
  await page.route('https://pagead2.googlesyndication.com/**', route => route.fulfill({
    contentType: 'application/javascript',
    body: 'window.adsbygoogle = { push: function() {} };',
  }));
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  await page.addStyleTag({ content: 'astro-dev-toolbar { display: none !important; }' });
  await expect(page.locator('#adsbygoogle-script')).toBeAttached();
  const ad = page.locator('[data-adsense-container]').first();
  const unit = ad.locator('ins');
  await expect(unit).not.toHaveAttribute('data-adsense-initialized', 'true');
  // An unrequested unit must not be collapsed by a page-wide timeout.
  await page.waitForTimeout(10500);
  await expect(ad).toHaveAttribute('data-adsense-state', 'pending');
  await page.locator('#consent-reject').click();
  await ad.scrollIntoViewIfNeeded();
  await expect(unit).toHaveAttribute('data-adsense-initialized', 'true');
  await unit.evaluate(el => el.setAttribute('data-ad-status', 'unfill-optimized'));
  await expect(ad).toBeHidden();
  await unit.evaluate(el => el.setAttribute('data-ad-status', 'filled'));
  await expect(ad).toBeVisible();
});
