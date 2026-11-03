import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'
import { connect, expectClean, watchProblems } from './helpers'

test.describe('F06 browse the library', () => {
  test.beforeEach(async ({ page }) => {
    await connect(page)
  })

  test('F06-H1 page through albums and open an artist', async ({ page }) => {
    const problems = watchProblems(page)
    await page.goto('/library')
    await expect(page.getByRole('link', { name: /Archive 00/ })).toBeVisible()

    const a11y = await new AxeBuilder({ page }).analyze()
    expect(a11y.violations).toEqual([])

    await page.getByRole('button', { name: 'Load more' }).click()
    await expect(page.getByRole('link', { name: /Neon Hours/ })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Load more' })).toHaveCount(0)

    await page.getByRole('button', { name: /artists/i }).click()
    await page.getByRole('link', { name: /^The Signals/ }).click()
    await expect(page.getByRole('heading', { name: 'The Signals' })).toBeVisible()
    await expect(page.getByRole('link', { name: /Night Bus/ })).toBeVisible()
    await expectClean(problems)
  })

  test('F06-E1 empty library says so', async ({ page }) => {
    const problems = watchProblems(page)
    await connect(page, { empty: true })
    await page.goto('/library')
    await expect(page.getByText('No albums in your library yet.')).toBeVisible()
    await expectClean(problems)
  })

  test('F06-E2 phone width has no horizontal scroll', async ({ page }) => {
    const problems = watchProblems(page)
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto('/library')
    await expect(page.getByRole('link', { name: 'Library' })).toBeVisible()

    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - window.innerWidth,
    )
    expect(overflow).toBeLessThanOrEqual(1)
    await expectClean(problems)
  })
})

test.describe('F06 phone width', () => {
  test.beforeEach(async ({ page }) => {
    await connect(page)
    await page.setViewportSize({ width: 390, height: 844 })
  })

  test('F06-E3 every screen fits and mute stays reachable', async ({ page }) => {
    const routes = ['/', '/search', '/library', '/library?tab=artists', '/library?tab=playlists', '/liked', '/album/al1', '/artist/ar1', '/playlist/pl1', '/settings']
    for (const route of routes) {
      await page.goto(route)
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)
      expect(overflow, route).toBeLessThanOrEqual(1)
    }

    const mute = page.locator('footer').getByRole('button', { name: 'Mute' })
    await mute.click()
    await expect(page.locator('footer').getByRole('button', { name: 'Unmute' })).toBeVisible()
  })
})
