import { test, expect } from '@playwright/test';

for (const width of [1440, 390]) {
  test(`anúncio automático vazio não sobrepõe o feed (${width}px)`, async ({ page }) => {
    // Reproduce the provider's empty zero-width ins with a still-sized iframe,
    // without requesting real ads or depending on inventory availability.
    await page.route('**/pagead2.googlesyndication.com/**', route => route.abort());
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/');
    await page.evaluate(() => {
      const article = document.querySelector('main article.grid');
      if (!article) throw new Error('Feed article missing');
      const wrapper = document.createElement('div');
      wrapper.className = 'google-auto-placed';
      wrapper.innerHTML = '<ins id="empty-auto-ad" class="adsbygoogle adsbygoogle-noablate" data-ad-status="unfilled" style="display:block;position:relative;margin:10px auto;width:0;height:0"><iframe title="Simulated ad" style="position:absolute;left:0;top:0;width:792px;height:250px;border:0"></iframe></ins>';
      article.before(wrapper);
    });

    const ad = page.locator('#empty-auto-ad');
    const frame = ad.locator('iframe');
    await expect(ad).toBeHidden();
    await expect(frame).toBeHidden();
    expect(await page.evaluate(() => document.documentElement.scrollWidth))
      .toBeLessThanOrEqual(width);

    // A later filled response must be visible in its original placement.
    await ad.evaluate(element => {
      const availableWidth = element.parentElement!.getBoundingClientRect().width;
      (element as HTMLElement).style.width = `${availableWidth}px`;
      (element as HTMLElement).style.height = '250px';
      (element.querySelector('iframe') as HTMLElement).style.width = '100%';
      element.setAttribute('data-ad-status', 'filled');
    });
    await expect(ad).toBeVisible();
    await expect(frame).toBeVisible();
    const adBounds = (await ad.boundingBox())!;
    const frameBounds = (await frame.boundingBox())!;
    expect(frameBounds.x).toBeCloseTo(adBounds.x);
    expect(frameBounds.width).toBeCloseTo(adBounds.width);
    expect(frameBounds.height).toBe(250);

    await ad.evaluate(element => element.setAttribute('data-ad-status', 'unfilled'));
    await expect(frame).toBeHidden();
  });
}
