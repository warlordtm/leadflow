import { test, expect } from '@playwright/test'
import { registerAndLogin } from '../fixtures/auth.setup'

test.describe('Lead Management', () => {
  test.describe.configure({ mode: 'serial' })

  let leadId: string

  test('user can create a new lead', async ({ page }) => {
    await registerAndLogin(page, 'lead-create@e2e.test', 'Lead Create')

    await page.click('text=Leads')
    await page.waitForURL('**/leads')

    await page.click('text=+ New Lead')
    await page.waitForURL('**/leads/new')

    await page.fill('input[id="name"]', 'Test Lead E2E')
    await page.fill('input[id="email"]', 'lead-e2e@test.com')
    await page.fill('input[id="phone"]', '555-1234')
    await page.fill('input[id="company"]', 'Test Company')
    await page.selectOption('select[id="source"]', 'WEBSITE')

    await page.click('button[type="submit"]')
    await page.waitForURL('**/leads')

    await expect(page.locator('text=Test Lead E2E')).toBeVisible()
  })

  test('user can view lead details', async ({ page }) => {
    await registerAndLogin(page, 'lead-view@e2e.test', 'Lead View')

    await page.click('text=Leads')
    await page.waitForURL('**/leads')

    // Create a lead first
    await page.click('text=+ New Lead')
    await page.waitForURL('**/leads/new')
    await page.fill('input[id="name"]', 'View Test Lead')
    await page.click('button[type="submit"]')
    await page.waitForURL('**/leads')

    // Click on the lead
    await page.click('a[href^="/leads/"]')
    await page.waitForURL(/\/leads\/[^/]+$/)

    await expect(page.locator('h1')).toHaveText('View Test Lead')
    await expect(page.locator('text=Lead Information')).toBeVisible()
  })

  test('user can search leads', async ({ page }) => {
    await registerAndLogin(page, 'lead-search@e2e.test', 'Lead Search')

    await page.click('text=Leads')
    await page.waitForURL('**/leads')

    // Create a uniquely named lead
    await page.click('text=+ New Lead')
    await page.waitForURL('**/leads/new')
    await page.fill('input[id="name"]', 'Unique Searchable Lead XYZ123')
    await page.click('button[type="submit"]')
    await page.waitForURL('**/leads')

    // Search for it
    await page.fill('input[placeholder="Search leads..."]', 'Unique Searchable Lead XYZ123')

    await expect(page.locator('text=Unique Searchable Lead XYZ123')).toBeVisible()
    await expect(page.locator('a[href^="/leads/"]')).toHaveCount(1)
  })

  test('user can update lead status', async ({ page }) => {
    await registerAndLogin(page, 'lead-status@e2e.test', 'Lead Status')

    await page.click('text=Leads')
    await page.click('text=+ New Lead')
    await page.waitForURL('**/leads/new')
    await page.fill('input[id="name"]', 'Status Test Lead')
    await page.click('button[type="submit"]')
    await page.waitForURL('**/leads')

    // Click on the lead
    await page.click('a[href^="/leads/"]')
    await page.waitForURL(/\/leads\/[^/]+$/)

    // Status should be NEW initially
    await expect(page.locator('span', { hasText: 'NEW' })).toBeVisible()

    // Click CONTACTED status
    await page.click('button:has-text("CONTACTED")')

    // Status should update
    await expect(page.locator('span', { hasText: 'CONTACTED' })).toBeVisible()
  })

  test('user can filter leads by status', async ({ page }) => {
    await registerAndLogin(page, 'lead-filter@e2e.test', 'Lead Filter')

    await page.click('text=Leads')
    await page.waitForURL('**/leads')

    // Create a WON lead
    await page.click('text=+ New Lead')
    await page.waitForURL('**/leads/new')
    await page.fill('input[id="name"]', 'Won Lead E2E')
    await page.selectOption('select[id="source"]', 'WEBSITE')
    await page.click('button[type="submit"]')
    await page.waitForURL('**/leads')

    // Filter by WON
    await page.selectOption('select', 'WON')

    await expect(page.locator('text=Won Lead E2E')).toBeVisible()
  })

  test('user can edit lead information', async ({ page }) => {
    await registerAndLogin(page, 'lead-edit@e2e.test', 'Lead Edit')

    await page.click('text=Leads')
    await page.click('text=+ New Lead')
    await page.waitForURL('**/leads/new')
    await page.fill('input[id="name"]', 'Edit Test Lead')
    await page.fill('input[id="email"]', 'original@test.com')
    await page.click('button[type="submit"]')
    await page.waitForURL('**/leads')

    // Click on the lead
    await page.click('a[href^="/leads/"]')
    await page.waitForURL(/\/leads\/[^/]+$/)

    // Click edit notes
    await page.click('text=Edit')
    await page.fill('textarea', 'Updated notes for testing')
    await page.click('button:has-text("Save")')

    await expect(page.locator('text=Updated notes for testing')).toBeVisible()
  })
})
