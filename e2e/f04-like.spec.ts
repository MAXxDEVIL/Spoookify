import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'
import { connect, expectClean, watchProblems } from './helpers'

test.describe('F04 like and save', () => {
  test.beforeEach(async ({ page }) => {
    await connect(page)
  })

  test('F04-H1 like a search result and find it in Liked', async ({ page }) => {
    const problems = watchProblems(page)
    await page.goto('/search')
    await page.getByRole('searchbox', { name: /search your library/i }).fill('neon')
    await page.getByRole('button', { name: 'Like Neon Hours' }).click()
    await expect(page.getByRole('button', { name: 'Unlike Neon Hours' })).toBeVisible()

    await page.getByRole('link', { name: 'Liked' }).click()
    await expect(page.getByRole('heading', { name: 'Liked songs' })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Unlike Neon Hours' })).toBeVisible()
    await expect(page.getByText('2 tracks')).toBeVisible()

    const a11y = await new AxeBuilder({ page }).analyze()
    expect(a11y.violations).toEqual([])
    await expectClean(problems)
  })

  test('F04-E1 unlike removes the row immediately', async ({ page }) => {
    const problems = watchProblems(page)
    await page.goto('/liked')
    await expect(page.getByRole('button', { name: 'Unlike Field Notes' })).toBeVisible()

    await page.getByRole('button', { name: 'Unlike Field Notes' }).click()
    await expect(page.getByRole('button', { name: 'Unlike Field Notes' })).toHaveCount(0)
    await expect(page.getByText('0 tracks')).toBeVisible()
    await expectClean(problems)
  })
})
