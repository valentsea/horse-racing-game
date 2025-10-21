import { test, expect } from '@playwright/test'

test.describe('Horse Racing Game - UI Components', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
  })

  test('should display correct initial UI', async ({ page }) => {
    // Check header - now it's in the horses section
    await expect(page.locator('h3')).toContainText('🐎 Horses')

    // Check empty state
    await expect(page.locator('h2')).toContainText('Ready to Race?')
    await expect(page.locator('p')).toContainText('Generate horses and start racing!')

    // Check generate button
    const generateButton = page.locator('[data-testid="generate-horses-button"]')
    await expect(generateButton).toBeVisible()
    await expect(generateButton).toContainText('Generate Horses')
  })

  test('should show horses list after generation', async ({ page }) => {
    await page.click('[data-testid="generate-horses-button"]')
    await page.waitForSelector('[data-testid="horse-item"]')

    // Check horses list header
    await expect(page.locator('h2')).toContainText('Horses')

    // Check horse items
    const horseItems = page.locator('[data-testid="horse-item"]')
    await expect(horseItems).toHaveCount(20)

    // Check first horse details
    const firstHorse = horseItems.first()
    await expect(firstHorse).toContainText('Horse 1')
  })

  test('should show race schedule after generation', async ({ page }) => {
    await page.click('[data-testid="generate-horses-button"]')
    await page.waitForSelector('[data-testid="horse-item"]')
    await page.click('text=Generate Schedule')
    await page.waitForSelector('[role="tab"]')

    // Check race tabs
    const raceTabs = page.locator('[role="tab"]')
    await expect(raceTabs).toHaveCount(7) // 6 races + statistics

    // Check tab labels
    await expect(raceTabs.nth(0)).toContainText('Round 1')
    await expect(raceTabs.nth(1)).toContainText('Round 2')
    await expect(raceTabs.nth(6)).toContainText('Statistics')
  })

  test('should show race track correctly', async ({ page }) => {
    await page.click('[data-testid="generate-horses-button"]')
    await page.waitForSelector('[data-testid="horse-item"]')
    await page.click('text=Generate Schedule')
    await page.waitForSelector('[role="tab"]')

    // Click on first race tab
    await page.click('[role="tab"]:first-child')

    // Check race track elements
    await expect(page.locator('text=Race Track')).toBeVisible()
    await expect(page.locator('text=Distance:')).toBeVisible()
    await expect(page.locator('text=Start Race')).toBeVisible()
  })

  test('should show race results correctly', async ({ page }) => {
    await page.click('[data-testid="generate-horses-button"]')
    await page.waitForSelector('[data-testid="horse-item"]')
    await page.click('text=Generate Schedule')
    await page.waitForSelector('[role="tab"]')

    // Start first race
    await page.click('[role="tab"]:first-child')
    await page.click('text=Start Race')
    await page.waitForSelector('text=Race Completed', { timeout: 15000 })

    // Check results table
    await expect(page.locator('text=Race Results')).toBeVisible()
    await expect(page.locator('th:has-text("Position")')).toBeVisible()
    await expect(page.locator('th:has-text("Horse")')).toBeVisible()
    await expect(page.locator('th:has-text("Time")')).toBeVisible()
    await expect(page.locator('th:has-text("Speed")')).toBeVisible()

    // Check results data
    const resultRows = page.locator('tbody tr')
    await expect(resultRows).toHaveCount(10)

    // Check first place
    await expect(resultRows.first().locator('td').first()).toContainText('1')
  })

  test('should show statistics correctly', async ({ page }) => {
    await page.click('[data-testid="generate-horses-button"]')
    await page.waitForSelector('[data-testid="horse-item"]')
    await page.click('text=Generate Schedule')
    await page.waitForSelector('[role="tab"]')

    // Click statistics tab
    await page.click('text=Statistics')

    // Check statistics elements
    await expect(page.locator('text=Game Statistics')).toBeVisible()
    await expect(page.locator('text=Total Races:')).toBeVisible()
    await expect(page.locator('text=Total Horses:')).toBeVisible()
    await expect(page.locator('text=Completed Races:')).toBeVisible()
  })

  test('should handle button states correctly', async ({ page }) => {
    // Initially generate button should be enabled
    const generateButton = page.locator('[data-testid="generate-horses-button"]')
    await expect(generateButton).toBeEnabled()

    // Generate horses
    await page.click('[data-testid="generate-horses-button"]')
    await page.waitForSelector('[data-testid="horse-item"]')

    // Generate schedule
    await page.click('text=Generate Schedule')
    await page.waitForSelector('[role="tab"]')

    // Start race button should be enabled
    await page.click('[role="tab"]:first-child')
    const startButton = page.locator('text=Start Race')
    await expect(startButton).toBeEnabled()

    // Start race
    await page.click('text=Start Race')

    // Button should be disabled during race
    await expect(startButton).toBeDisabled()

    // Wait for completion
    await page.waitForSelector('text=Race Completed', { timeout: 15000 })

    // Reset button should be enabled
    const resetButton = page.locator('text=Reset Race')
    await expect(resetButton).toBeEnabled()
  })

  test('should show proper loading states', async ({ page }) => {
    // Generate horses
    await page.click('[data-testid="generate-horses-button"]')

    // Should show loading state (if implemented)
    await page.waitForSelector('[data-testid="horse-item"]', { timeout: 10000 })

    // Generate schedule
    await page.click('text=Generate Schedule')
    await page.waitForSelector('[role="tab"]', { timeout: 5000 })
  })

  test('should handle error messages', async ({ page }) => {
    // Try to generate schedule without horses
    await page.click('text=Generate Schedule')

    // Should remain in same state or show error
    await expect(page.locator('h2')).toContainText('Ready to Race?')
  })

  test('should be accessible with keyboard', async ({ page }) => {
    // Tab through elements
    await page.keyboard.press('Tab')
    await expect(page.locator('[data-testid="generate-horses-button"]')).toBeFocused()

    // Generate horses with Enter
    await page.keyboard.press('Enter')
    await page.waitForSelector('[data-testid="horse-item"]')

    // Tab to schedule button
    await page.keyboard.press('Tab')
    await page.keyboard.press('Enter')
    await page.waitForSelector('[role="tab"]')

    // Tab to race tab
    await page.keyboard.press('Tab')
    await page.keyboard.press('Enter')

    // Tab to start button
    await page.keyboard.press('Tab')
    await page.keyboard.press('Enter')

    // Wait for race completion
    await page.waitForSelector('text=Race Completed', { timeout: 15000 })
  })

  test('should handle window resize', async ({ page }) => {
    // Generate horses and schedule
    await page.click('[data-testid="generate-horses-button"]')
    await page.waitForSelector('[data-testid="horse-item"]')
    await page.click('text=Generate Schedule')
    await page.waitForSelector('[role="tab"]')

    // Resize to mobile
    await page.setViewportSize({ width: 375, height: 667 })

    // Verify layout still works
    await expect(page.locator('h1')).toBeVisible()
    await expect(page.locator('[role="tab"]')).toBeVisible()

    // Resize to desktop
    await page.setViewportSize({ width: 1920, height: 1080 })

    // Verify layout adapts
    await expect(page.locator('h1')).toBeVisible()
    await expect(page.locator('[role="tab"]')).toBeVisible()
  })
})
