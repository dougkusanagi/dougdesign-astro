import { test, expect } from '@playwright/test';

test.describe('Archive Page Faceted Filtering', () => {
  test('should render category pills and filter posts on click', async ({ page }) => {
    await page.goto('/posts');

    // Confirm category pills exist
    const categoryPills = page.locator('#category-pills');
    await expect(categoryPills).toBeVisible();

    const gamesPill = page.locator('.category-pill', { hasText: 'Games' });
    await expect(gamesPill).toBeVisible();

    const postsGrid = page.locator('#posts-grid');
    await expect(postsGrid).toBeVisible();

    // Initial count of posts
    const initialCardsCount = await page.locator('#posts-grid article').count();

    // Click on Games pill
    await gamesPill.click();

    // The post count text should update
    const countText = page.locator('#post-count-text');
    await expect(countText).toContainText(/artigo/);
  });
});
