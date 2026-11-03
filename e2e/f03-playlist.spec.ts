import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'
import { connect, expectClean, watchProblems } from './helpers'

test.describe('F03 build a playlist', () => {
  test.beforeEach(async ({ page }) => {
    await connect(page)
  })

  test('F03-H1 add a track, then rename the playlist', async ({ page }) => {
    const problems = watchProblems(page)
    await page.goto('/library?tab=playlists')
    await page.getByRole('link', { name: /Morning mix/ }).click()
    await expect(page.getByRole('heading', { name: 'Morning mix' })).toBeVisible()

    await page.getByRole('button', { name: 'Add tracks' }).click()
    const add = page.getByRole('dialog', { name: 'Add tracks' })
    await add.getByRole('searchbox', { name: /search your library/i }).fill('night')
    await add.getByRole('button', { name: 'Search', exact: true }).click()
    await add.getByRole('button', { name: 'Add Night Bus', exact: true }).click()
    await expect(add.getByRole('button', { name: 'Night Bus added' })).toBeDisabled()
    await add.getByRole('button', { name: 'Close' }).click()

    await expect(page.getByText('3 tracks')).toBeVisible()

    await page.getByRole('button', { name: 'Rename' }).click()
    const rename = page.getByRole('dialog', { name: 'Rename playlist' })
    await rename.getByLabel('Name').fill('Evening mix')
    await rename.getByRole('button', { name: 'Save' }).click()
    await expect(page.getByRole('heading', { name: 'Evening mix' })).toBeVisible()

    const a11y = await new AxeBuilder({ page }).analyze()
    expect(a11y.violations).toEqual([])
    await expectClean(problems)
  })

  test('F03-E1 empty playlist says so', async ({ page }) => {
    const problems = watchProblems(page)
    await page.goto('/library?tab=playlists')
    await page.getByRole('link', { name: /Empty/ }).click()
    await expect(page.getByText('This playlist is empty.')).toBeVisible()
    await expectClean(problems)
  })

  test('F03-E2 create a playlist from Library', async ({ page }) => {
    const problems = watchProblems(page)
    await page.goto('/library?tab=playlists')
    await page.getByRole('button', { name: 'New playlist' }).click()

    const dialog = page.getByRole('dialog', { name: 'New playlist' })
    await dialog.getByLabel('Name').fill('Road trip')
    await dialog.getByRole('button', { name: 'Create' }).click()

    await expect(page.getByRole('link', { name: /Road trip/ })).toBeVisible()
    await expectClean(problems)
  })

  test('F03-N1 delete asks first and removes the playlist', async ({ page }) => {
    const problems = watchProblems(page)
    await page.goto('/library?tab=playlists')
    await page.getByRole('link', { name: /Morning mix/ }).click()
    page.once('dialog', (dialog) => dialog.accept())
    await page.getByRole('button', { name: 'Delete' }).click()

    await expect(page).toHaveURL(/\/library\?tab=playlists$/)
    await expect(page.getByRole('link', { name: /Morning mix/ })).toHaveCount(0)
    await expectClean(problems)
  })
})
