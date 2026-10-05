import { test, expect } from '@playwright/test'

test('kiosk returns to PIN entry after check-in confirmation timeout', async ({ page }) => {
  await page.goto('/kiosk')
  await page.waitForLoadState('networkidle')

  // Identify
  await page.getByTestId('pin-input').fill('1234')
  await page.getByRole('button', { name: 'Continue' }).click()

  // Wait for project picker
  await expect(page.getByRole('radio').first()).toBeVisible()

  // Pick project and check in
  await page.getByRole('radio').first().click()
  await page.getByTestId('check-in').click()

  // Confirm we're on shift, countdown is visible
  await expect(page.getByTestId('on-shift')).toBeVisible()
  await expect(page.getByTestId('auto-reset-countdown')).toBeVisible()

  // Wait for the reset (10s + small buffer)
  await expect(page.getByTestId('pin-input')).toBeVisible({ timeout: 15_000 })

  // Confirm we're back to idle — no welcome message, no on-shift
  await expect(page.getByText(/Welcome,/)).not.toBeVisible()
  await expect(page.getByTestId('on-shift')).not.toBeVisible()
})