import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: './e2e',
  fullyParallel: false,
  workers: 1,
  retries: 0,
  reporter: [['list']],
  use: {
    baseURL: 'http://localhost:5173',
    viewport: { width: 1280, height: 900 },
    launchOptions: { args: ['--autoplay-policy=no-user-gesture-required'] },
  },
  webServer: [
    {
      command: 'node e2e/mock-server.mjs',
      port: 5300,
      reuseExistingServer: true,
    },
    {
      command: 'npm run dev -- --port 5173',
      port: 5173,
      reuseExistingServer: true,
    },
  ],
})
