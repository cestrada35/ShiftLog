import { defineConfig, devices } from '@playwright/test'
import { execSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const API_DIR = path.resolve(__dirname, '../api')

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: false,
  workers: 1,
  forbidOnly: !!process.env.CI,
  retries: 0,
  reporter: [['list']],

  globalSetup: './tests/e2e/global-setup.ts',

  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
  },

  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  ],

  webServer: {
  command: 'npm run dev',
  port: 3000,
  reuseExistingServer: false,
  timeout: 120_000,
  stdout: 'pipe',
  stderr: 'pipe',
  env: {
    NUXT_PUBLIC_USE_MOCKS: 'false',
  },
},
})
