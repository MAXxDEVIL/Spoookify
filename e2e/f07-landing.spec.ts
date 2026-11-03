import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'
import { expectClean, watchProblems } from './helpers'

test.describe('F07 first visit', () => {
  test('F07-H1 the landing page explains the app and reaches the connect screen', async ({ page }) => {
    const problems = watchProblems(page)
    await page.goto('/')

    await expect(page.getByRole('heading', { name: 'Your music. Every track once.' })).toBeVisible()
    await expect(page.getByAltText(/Wholecrate home screen/)).toBeVisible()

    const a11y = await new AxeBuilder({ page }).analyze()
    expect(a11y.violations).toEqual([])

    await page.getByRole('link', { name: 'Connect your library' }).first().click()
    await expect(page).toHaveURL(/\/settings$/)
    await expect(page.getByRole('heading', { name: 'Point Wholecrate at your music' })).toBeVisible()
    await expectClean(problems)
  })
})
