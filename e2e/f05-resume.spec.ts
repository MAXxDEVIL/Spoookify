import { test, expect } from '@playwright/test'
import { connect, watchProblems } from './helpers'

test.describe('F05 resume last track', () => {
  test.beforeEach(async ({ page }) => {
    await connect(page)
  })

  test('F05-H1 reload restores the queue and the current track, paused', async ({ page }) => {
    const problems = watchProblems(page)
    await page.goto('/')

    // Seed the persisted state directly: clicking play first would let the
    // pagehide handler overwrite it with the live queue on reload.
    await page.evaluate(() => {
      localStorage.setItem(
        'wholecrate.player',
        JSON.stringify({
          queue: [
            { id: 's1', title: 'Neon Hours', artist: 'The Signals', duration: 180, coverArt: 'c1' },
            { id: 's2', title: 'Slow Static', artist: 'The Signals', duration: 240, coverArt: 'c1' },
          ],
          index: 1,
          playing: true,
          positionMs: 65_000,
          volume: 0.8,
          shuffle: false,
          repeat: 'off',
        }),
      )
    })
    await page.reload()

    await expect(page.locator('footer')).toContainText('Slow Static')
    await expect(page.locator('footer')).toContainText('The Signals')
    expect(await page.evaluate(() => document.querySelector('audio')?.paused)).toBe(true)
    expect(problems).toEqual([])
  })

  test('F05-E1 a track deleted server-side does not crash the app', async ({ page }) => {
    await page.goto('/')
    await page.evaluate(() => {
      localStorage.setItem(
        'wholecrate.player',
        JSON.stringify({
          queue: [{ id: 'gone', title: 'Deleted Track', artist: 'Nobody', duration: 180 }],
          index: 0,
          playing: false,
          positionMs: 0,
          volume: 0.8,
          shuffle: false,
          repeat: 'off',
        }),
      )
    })
    await page.reload()

    await expect(page.locator('footer')).toContainText('Deleted Track')
    await page.locator('footer').getByRole('button', { name: 'Play', exact: true }).click()
    await expect(page.locator('footer')).toContainText('Deleted Track')
    await expect(page.getByRole('heading', { name: 'Home' })).toBeVisible()
  })
})
