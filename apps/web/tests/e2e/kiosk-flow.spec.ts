import { test, expect } from '@playwright/test'

test('volunteer can check in and check out', async ({ page }) => {
  await page.goto('/kiosk')
  await page.waitForLoadState('networkidle')

  // Identify
  await expect(page.getByText('ShiftLog Kiosk')).toBeVisible()
  await page.getByTestId('pin-input').fill('1234')
  await page.getByRole('button', { name: 'Continue' }).click()

  // Project picker appears with real data from Django
  await expect(page.getByText('Welcome, Mark S.')).toBeVisible()
  await expect(page.getByRole('radio')).toHaveCount(2)

  // Pick the first project
  const firstProject = page.getByRole('radio').first()
  await firstProject.click()
  await expect(firstProject).toHaveAttribute('aria-checked', 'true')

  // Check in
  await page.getByTestId('check-in').click()
  await expect(page.getByTestId('on-shift')).toBeVisible()

  // Check out
  await page.getByTestId('check-out').click()
  await expect(page.getByTestId('completed')).toBeVisible()
  await expect(page.getByText('Thanks, Mark S.')).toBeVisible()
})