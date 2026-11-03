import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'
import { connect, expectClean, isAudioPlaying, watchProblems } from './helpers'

test.describe('F02 queue and change track', () => {
  test.beforeEach(async ({ page }) => {
    await connect(page)
  })

  test('F02-H1 queue lists what plays next, removing the current advances', async ({ page }) => {
    const problems = watchProblems(page)
    await page.goto('/album/al1')
    await page.getByRole('main').getByRole('button', { name: 'Play', exact: true }).click()
    await page.locator('footer').getByRole('button', { name: 'Queue', exact: true }).click()

    const dialog = page.getByRole('dialog', { name: 'Queue' })
    await expect(dialog).toBeVisible()
    await expect(dialog.getByRole('listitem')).toHaveCount(2)
    await expect(dialog).toContainText('Slow Static')

    await dialog.getByRole('button', { name: 'Remove Neon Hours from queue' }).click()
    await expect(dialog.getByRole('listitem')).toHaveCount(1)
    await expect(page.locator('footer')).toContainText('Slow Static')

    await page.keyboard.press('Escape')
    await expect(dialog).not.toBeVisible()

    const a11y = await new AxeBuilder({ page }).analyze()
    expect(a11y.violations).toEqual([])
    await expectClean(problems)
  })

  test('F02-E1 clear keeps only the current track playing', async ({ page }) => {
    const problems = watchProblems(page)
    await page.goto('/album/al1')
    await page.getByRole('main').getByRole('button', { name: 'Play', exact: true }).click()
    await page.locator('footer').getByRole('button', { name: 'Queue', exact: true }).click()

    const dialog = page.getByRole('dialog', { name: 'Queue' })
    await dialog.getByRole('button', { name: 'Clear queue' }).click()

    await expect(dialog.getByRole('listitem')).toHaveCount(1)
    await expect(page.locator('footer')).toContainText('Neon Hours')
    await expect.poll(() => isAudioPlaying(page)).toBe(true)
    await expectClean(problems)
  })

  test('F02-E2 removing the last track clears the player', async ({ page }) => {
    const problems = watchProblems(page)
    await page.goto('/album/al3')
    await page.getByRole('main').getByRole('button', { name: 'Play', exact: true }).click()
    await page.locator('footer').getByRole('button', { name: 'Queue', exact: true }).click()

    const dialog = page.getByRole('dialog', { name: 'Queue' })
    await dialog.getByRole('button', { name: 'Remove Night Bus from queue' }).click()

    await expect(dialog).toContainText('The queue is empty')
    await expect(page.locator('footer')).toContainText('Nothing playing')
    await expect
      .poll(() => page.evaluate(() => document.querySelector('audio')?.paused ?? true))
      .toBe(true)
    await expectClean(problems)
  })
})
