import { test, expect } from '@playwright/test'
import { registerAndLogin } from '../fixtures/auth.setup'

test.describe('Follow-up Management', () => {
  test.describe.configure({ mode: 'serial' })

  test('user can schedule a follow-up from lead detail page', async ({
    page,
  }) => {
    await registerAndLogin(page, 'fu-create@e2e.test', 'FU Create')

    // Navigate to leads and create a lead first
    await page.click('text=Leads')
    await page.waitForURL('**/leads')
    await page.click('text=+ New Lead')
    await page.waitForURL('**/leads/new')
    await page.fill('input[id="name"]', 'Follow-up Test Lead')
    await page.click('button[type="submit"]')
    await page.waitForURL('**/leads')

    // Click into the lead
    await page.click('a[href^="/leads/"]')
    await page.waitForURL(/\/leads\/[^/]+$/)

    // Schedule a follow-up
    await page.click('text=+ Schedule Follow-up')

    // Fill in the follow-up form
    await page.fill('input[type="datetime-local"]', '2026-12-31T10:00')
    await page.selectOption('select', 'CALL')
    await page.fill('textarea', 'Test follow-up notes')
    await page.click('button:has-text("Schedule")')

    // Should show the scheduled follow-up
    await expect(page.locator('text=Test follow-up notes')).toBeVisible()
  })

  test('user can view follow-ups page', async ({ page }) => {
    await registerAndLogin(page, 'fu-view@e2e.test', 'FU View')

    await page.click('text=Follow-ups')
    await page.waitForURL('**/follow-ups')

    await expect(page.locator('h1')).toHaveText('Follow-ups')
    await expect(page.locator('button:has-text("Today\'s")')).toBeVisible()
    await expect(page.locator('button:has-text("Upcoming")')).toBeVisible()
    await expect(page.locator('button:has-text("Overdue")')).toBeVisible()
    await expect(page.locator('button:has-text("Completed")')).toBeVisible()
  })

  test('user can mark a follow-up as completed', async ({ page }) => {
    await registerAndLogin(page, 'fu-complete@e2e.test', 'FU Complete')

    // Create a lead and schedule a follow-up
    await page.click('text=Leads')
    await page.click('text=+ New Lead')
    await page.waitForURL('**/leads/new')
    await page.fill('input[id="name"]', 'Complete FU Test Lead')
    await page.click('button[type="submit"]')
    await page.waitForURL('**/leads')

    await page.click('a[href^="/leads/"]')
    await page.waitForURL(/\/leads\/[^/]+$/)

    // Schedule a follow-up for today
    await page.click('text=+ Schedule Follow-up')
    const today = new Date()
    const formattedDate = today.toISOString().slice(0, 16)
    await page.fill('input[type="datetime-local"]', formattedDate)
    await page.selectOption('select', 'MESSAGE')
    await page.click('button:has-text("Schedule")')

    await expect(page.locator('text=Test follow-up notes').first()).toBeVisible()

    // Mark as complete from the lead detail page
    await page.click('button:has-text("Complete")').first()

    // Navigate to follow-ups completed tab
    await page.click('text=Follow-ups')
    await page.waitForURL('**/follow-ups')
    await page.click('button:has-text("Completed")')

    await expect(page.locator('text=MESSAGE')).toBeVisible()
  })

  test('user can navigate between follow-up tabs', async ({ page }) => {
    await registerAndLogin(page, 'fu-nav@e2e.test', 'FU Nav')

    await page.click('text=Follow-ups')
    await page.waitForURL('**/follow-ups')

    // Check tabs exist and are clickable
    await page.click('button:has-text("Upcoming")')
    await expect(page.locator('h1')).toHaveText('Follow-ups')

    await page.click('button:has-text("Overdue")')
    await expect(page.locator('h1')).toHaveText('Follow-ups')

    await page.click('button:has-text("Today\'s")')
    await expect(page.locator('h1')).toHaveText('Follow-ups')
  })
})
