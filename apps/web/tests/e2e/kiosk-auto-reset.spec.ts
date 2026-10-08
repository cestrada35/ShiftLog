import { test, expect } from '@playwright/test'

test('kiosk returns to PIN entry after check-in confirmation timeout', async ({ page }) => {
  await page.goto('/kiosk')
  await page.waitForLoadState('networkidle')

  await page.getByTestId('pin-input').fill('1234')
  await page.getByRole('button', { name: 'Continue' }).click()

  await expect(page.getByRole('radio').first()).toBeVisible()
  await page.getByRole('radio').first().click()
  await page.getByTestId('check-in').click()

  await expect(page.getByTestId('on-shift')).toBeVisible()
  await expect(page.getByTestId('auto-reset-countdown')).toBeVisible()

  // Auto-reset fires
  await expect(page.getByTestId('pin-input')).toBeVisible({ timeout: 15_000 })

  // Cleanup: Mark S is still on shift server-side. Check him out so the
  // next test file starts from a clean state.
  await page.getByTestId('pin-input').fill('1234')
  await page.getByRole('button', { name: 'Continue' }).click()
  await expect(page.getByTestId('check-out')).toBeVisible()
  await page.getByTestId('check-out').click()
  await expect(page.getByTestId('completed')).toBeVisible()
})