import { defineConfig, devices } from '@playwright/test'

const isCI = !!process.env.CI
const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? 'http://localhost:3000'

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: false,
  workers: 1,
  forbidOnly: isCI,
  retries: isCI ? 1 : 0,
  reporter: isCI ? [['github'], ['list']] : [['list']],
  globalSetup: './tests/e2e/global-setup.ts',
  use: {
    baseURL,
    trace: 'on-first-retry',
    launchOptions: isCI
      ? {
          args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-gpu',
            '--proxy-server=direct://',
            '--proxy-bypass-list=*',
            '--host-resolver-rules=MAP localhost 127.0.0.1',
          ],
        }
      : undefined,
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  ],
  webServer: isCI
    ? undefined
    : {
        command: 'npm run dev',
        port: 3000,
        reuseExistingServer: false,
        timeout: 120_000,
        env: { NUXT_PUBLIC_USE_MOCKS: 'false' },
      },
})