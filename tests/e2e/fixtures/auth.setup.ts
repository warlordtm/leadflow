import { Page } from '@playwright/test'

export async function registerAndLogin(page: Page, email: string, name: string) {
  const password = 'password123'

  await page.goto('/register')
  await page.fill('input[id="name"]', name)
  await page.fill('input[id="email"]', email)
  await page.fill('input[id="password"]', password)
  await page.click('button[type="submit"]')

  // Wait for redirect to dashboard or retry if user already exists
  try {
    await page.waitForURL('http://localhost:3000/dashboard', { timeout: 5000 })
  } catch {
    // User may already exist from a previous run, try logging in
    await page.goto('/login')
    await page.fill('input[id="email"]', email)
    await page.fill('input[id="password"]', password)
    await page.click('button[type="submit"]')
    await page.waitForURL('http://localhost:3000/dashboard')
  }
}
