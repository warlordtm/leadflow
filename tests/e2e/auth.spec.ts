import { test, expect } from '@playwright/test'

test.describe('Authentication Flow', () => {
  test('user can register an account', async ({ page }) => {
    await page.goto('/register')

    await page.fill('input[name="name"]', 'Test User')
    await page.fill('input[name="email"]', 'test-e2e@example.com')
    await page.fill('input[name="password"]', 'password123')

    await page.click('button[type="submit"]')

    // Should redirect to dashboard
    await page.waitForURL('http://localhost:3000/dashboard')
    await expect(page).toHaveURL('http://localhost:3000/dashboard')
  })

  test('user can login with registered credentials', async ({ page }) => {
    // First register
    await page.goto('/register')
    await page.fill('input[name="name"]', 'Login Test')
    await page.fill('input[name="email"]', 'login-e2e@example.com')
    await page.fill('input[name="password"]', 'password123')
    await page.click('button[type="submit"]')
    await page.waitForURL('http://localhost:3000/dashboard')

    // Logout
    await page.getByRole('link', { name: 'Sign out' }).click()
    await page.waitForURL('**/login')

    // Login again
    await page.goto('/login')
    await page.fill('input[name="email"]', 'login-e2e@example.com')
    await page.fill('input[name="password"]', 'password123')
    await page.click('button[type="submit"]')

    // Should redirect to dashboard
    await page.waitForURL('http://localhost:3000/dashboard')
    await expect(page).toHaveURL('http://localhost:3000/dashboard')
  })

  test('invalid credentials are rejected', async ({ page }) => {
    await page.goto('/login')
    await page.fill('input[name="email"]', 'nonexistent@example.com')
    await page.fill('input[name="password"]', 'wrongpassword')
    await page.click('button[type="submit"]')

    // Should show error message
    await expect(page.locator('text=Invalid email or password')).toBeVisible()
  })

  test('unauthenticated users are redirected from dashboard', async ({
    page,
  }) => {
    await page.goto('/dashboard')

    // Should be redirected to login
    await page.waitForURL(/_next\/.*\/login|localhost:3000\/login/)
  })
})
