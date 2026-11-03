import { expect, type Page } from '@playwright/test'

export const MOCK = 'http://localhost:5300'

// Resets fixture state and pins the app to the mock Subsonic server.
export async function connect(page: Page, options: { empty?: boolean } = {}) {
  await page.addInitScript(() => {
    localStorage.setItem(
      'wholecrate.server',
      JSON.stringify({ url: 'http://localhost:5300', user: 'tester', password: 'p' }),
    )
  })
  await page.request.get(`${MOCK}/reset${options.empty ? '?empty=1' : ''}`)
}

// Collects everything that should never happen, so a test can assert at the end.
export function watchProblems(page: Page) {
  const problems: string[] = []
  page.on('console', (message) => {
    if (message.type() === 'error') problems.push(`console: ${message.text()}`)
  })
  page.on('pageerror', (error) => problems.push(`pageerror: ${error.message}`))
  page.on('response', (response) => {
    if (response.status() >= 500) problems.push(`${response.status()} ${response.url()}`)
  })
  return problems
}

export async function isAudioPlaying(page: Page) {
  return page.evaluate(() => {
    const audio = document.querySelector('audio')
    return Boolean(audio && !audio.paused && audio.currentSrc)
  })
}

export async function expectClean(problems: string[]) {
  expect(problems).toEqual([])
}
