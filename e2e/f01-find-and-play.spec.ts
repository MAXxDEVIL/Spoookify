import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'
import { connect, expectClean, isAudioPlaying, watchProblems } from './helpers'

test.describe('F01 find and play', () => {
  test.beforeEach(async ({ page }) => {
    await connect(page)
  })

  test('F01-H1 search, open album, play', async ({ page }) => {
    const problems = watchProblems(page)
    await page.goto('/search')
    await page.getByRole('searchbox', { name: /search your library/i }).fill('field')
    await page.getByRole('link', { name: /Field Notes/ }).click()
    await expect(page.getByRole('heading', { name: 'Field Notes' })).toBeVisible()

    await page.getByRole('main').getByRole('button', { name: 'Play', exact: true }).click()
    await expect(page.locator('footer')).toContainText('Field Notes')
    await expect.poll(() => isAudioPlaying(page)).toBe(true)

    const a11y = await new AxeBuilder({ page }).analyze()
    expect(a11y.violations).toEqual([])
    await expectClean(problems)
  })

  test('F01-E1 no results says so', async ({ page }) => {
    const problems = watchProblems(page)
    await page.goto('/search')
    await page.getByRole('searchbox', { name: /search your library/i }).fill('zzzz')
    await expect(page.getByText(/nothing matches/i)).toBeVisible()
    await expectClean(problems)
  })

  test('F01-N1 wrong password keeps the user on settings', async ({ page }) => {
    const problems = watchProblems(page)
    await page.goto('/settings')
    await page.getByLabel('Server URL').fill('http://localhost:5300')
    await page.getByLabel('Username').fill('tester')
    await page.getByLabel('Password').fill('wrong')
    await page.getByRole('button', { name: 'Connect' }).click()

    await expect(page.getByRole('alert')).toContainText('Wrong username or password.')
    await expect(page).toHaveURL(/\/settings$/)
    await expectClean(problems)
  })
})
