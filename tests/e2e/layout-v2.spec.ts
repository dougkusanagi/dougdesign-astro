import { test, expect } from '@playwright/test';

test.describe('Layout v2 (beta) — navegação e avisos', () => {
  test('mega menu abre, mostra categorias e fecha com Esc', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/');

    const trigger = page.locator('.mega-trigger');
    const mega = page.locator('#mega');

    await expect(trigger).toHaveAttribute('aria-expanded', 'false');
    await trigger.click();
    await expect(trigger).toHaveAttribute('aria-expanded', 'true');
    await expect(mega).toHaveAttribute('data-open', 'true');
    await expect(mega.locator('[data-mega-cat="games"]')).toBeVisible();

    await page.keyboard.press('Escape');
    await expect(mega).toHaveAttribute('data-open', 'false');
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');
  });

  test('menu do celular abre em tela cheia e navega para a categoria', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/');

    await page.locator('.icon-btn[data-mega-toggle]').click();
    await expect(page.locator('#mega')).toHaveAttribute('data-open', 'true');
    await page.locator('[data-mega-cat="tecnologia"]').click();
    await expect(page).toHaveURL(/\/category\/tecnologia\/$/);
  });

  test('busca instantânea abre com "/" e encontra artigos', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('/');

    await page.keyboard.press('/');
    const input = page.locator('#search-input');
    await expect(input).toBeFocused();
    await input.fill('claude');

    const first = page.locator('#search-results a').first();
    await expect(first).toBeVisible();
    await page.keyboard.press('Enter');
    await page.waitForURL((url) => url.pathname !== '/');
  });

  test('aviso beta é informativo e pode ser dispensado de forma persistente', async ({ page }) => {
    await page.goto('/');

    const notice = page.locator('#beta-notice');
    await expect(notice).toBeVisible();

    await page.locator('[data-beta-open]').first().click();
    const dialog = page.locator('#beta-dialog');
    await expect(dialog).toBeVisible();
    await expect(dialog).toContainText('versão beta');
    await expect(dialog).toContainText('O que não muda');
    await dialog.locator('[data-beta-close]').last().click();
    await expect(dialog).not.toBeVisible();

    await page.locator('[data-beta-dismiss]').click();
    await expect(notice).toBeHidden();

    await page.reload();
    await expect(page.locator('#beta-notice')).toBeHidden();
  });

  test('anúncios só ocupam espaço depois do consentimento', async ({ page }) => {
    await page.goto('/');
    const html = page.locator('html');
    await expect(html).toHaveAttribute('data-ads', 'off');
    await expect(page.locator('[data-adsense-container]').first()).toBeHidden();

    await page.locator('#consent-accept').click();
    await expect(html).toHaveAttribute('data-ads', 'on');
    await expect(page.locator('[data-adsense-container]').first()).toBeVisible();
  });

  test('artigo mostra sumário, autor e leituras relacionadas', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/como-se-proteger-de-prompt-injection-ia/');

    await expect(page.locator('main h1')).toHaveCount(1);
    await expect(page.locator('nav[aria-label="Neste artigo"]')).toBeVisible();
    await expect(page.locator('article.prose')).toBeVisible();
    await expect(page.locator('[aria-labelledby="related-title"] article')).toHaveCount(3);
  });

  test('categorias são paginadas', async ({ page }) => {
    await page.goto('/category/games/');
    await expect(page.locator('main h1')).toContainText('Games');
    const cards = await page.locator('main article').count();
    expect(cards).toBeLessThanOrEqual(18);

    await page.locator('nav[aria-label="Paginação"] a[rel="next"]').click();
    await expect(page).toHaveURL(/\/category\/games\/2\/$/);
  });
});
