import { test, expect } from '@playwright/test'

test.describe('Horse Racing Game - Complete Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
  })

  test('should complete full game flow', async ({ page }) => {
    // Step 1: Verify initial state
    await expect(page.locator('h1')).toContainText('Horse Racing Game')
    await expect(page.locator('h2')).toContainText('Ready to Race?')

    // Step 2: Generate horses
    await page.click('[data-testid="generate-horses-button"]')
    await page.waitForSelector('[data-testid="horse-item"]', { timeout: 10000 })

    // Verify horses are generated
    const horseItems = page.locator('[data-testid="horse-item"]')
    await expect(horseItems).toHaveCount(20)

    // Step 3: Generate race schedule
    await page.click('text=Generate Schedule')
    await page.waitForSelector('[role="tab"]', { timeout: 5000 })

    // Verify race tabs are created
    const raceTabs = page.locator('[role="tab"]')
    await expect(raceTabs).toHaveCount(7) // 6 races + statistics tab

    // Step 4: Start first race
    await page.click('[role="tab"]:first-child')
    await page.click('text=Start Race')

    // Wait for race to complete
    await page.waitForSelector('text=Race Completed', { timeout: 15000 })

    // Verify race results
    await expect(page.locator('text=Position')).toBeVisible()
    await expect(page.locator('text=Horse')).toBeVisible()
    await expect(page.locator('text=Time')).toBeVisible()

    // Step 5: Start all races
    await page.click('text=Start All Races')

    // Wait for all races to complete
    await page.waitForSelector('text=All races completed!', { timeout: 30000 })

    // Step 6: Check statistics
    await page.click('text=Statistics')
    await expect(page.locator('text=Game Statistics')).toBeVisible()
    await expect(page.locator('text=Total Races: 6')).toBeVisible()
    await expect(page.locator('text=Completed Races: 6')).toBeVisible()
  })

  test('should handle individual race execution', async ({ page }) => {
    // Generate horses and schedule
    await page.click('[data-testid="generate-horses-button"]')
    await page.waitForSelector('[data-testid="horse-item"]')
    await page.click('text=Generate Schedule')
    await page.waitForSelector('[role="tab"]')

    // Start first race individually
    await page.click('[role="tab"]:first-child')
    await page.click('text=Start Race')

    // Verify race is running
    await expect(page.locator('text=Racing...')).toBeVisible()

    // Wait for completion
    await page.waitForSelector('text=Race Completed', { timeout: 15000 })

    // Verify results are displayed
    await expect(page.locator('text=Position')).toBeVisible()
    await expect(page.locator('text=Horse')).toBeVisible()
    await expect(page.locator('text=Time')).toBeVisible()
  })

  test('should reset individual race', async ({ page }) => {
    // Generate horses and schedule
    await page.click('[data-testid="generate-horses-button"]')
    await page.waitForSelector('[data-testid="horse-item"]')
    await page.click('text=Generate Schedule')
    await page.waitForSelector('[role="tab"]')

    // Complete a race
    await page.click('[role="tab"]:first-child')
    await page.click('text=Start Race')
    await page.waitForSelector('text=Race Completed', { timeout: 15000 })

    // Reset the race
    await page.click('text=Reset Race')

    // Verify race is reset
    await expect(page.locator('text=Start Race')).toBeVisible()
    await expect(page.locator('text=Race Completed')).not.toBeVisible()
  })

  test('should reset all races', async ({ page }) => {
    // Generate horses and schedule
    await page.click('[data-testid="generate-horses-button"]')
    await page.waitForSelector('[data-testid="horse-item"]')
    await page.click('text=Generate Schedule')
    await page.waitForSelector('[role="tab"]')

    // Complete some races
    await page.click('[role="tab"]:first-child')
    await page.click('text=Start Race')
    await page.waitForSelector('text=Race Completed', { timeout: 15000 })

    // Reset all races
    await page.click('text=Reset All Rounds')

    // Verify all races are reset
    await page.click('[role="tab"]:first-child')
    await expect(page.locator('text=Start Race')).toBeVisible()
    await expect(page.locator('text=Race Completed')).not.toBeVisible()
  })

  test('should reset entire game', async ({ page }) => {
    // Generate horses and schedule
    await page.click('[data-testid="generate-horses-button"]')
    await page.waitForSelector('[data-testid="horse-item"]')
    await page.click('text=Generate Schedule')
    await page.waitForSelector('[role="tab"]')

    // Reset game
    await page.click('text=New Game')

    // Verify game is reset
    await expect(page.locator('h2')).toContainText('Ready to Race?')
    await expect(page.locator('[data-testid="horse-item"]')).not.toBeVisible()
    await expect(page.locator('[role="tab"]')).not.toBeVisible()
  })

  test('should show loading states', async ({ page }) => {
    // Generate horses and verify loading state
    await page.click('[data-testid="generate-horses-button"]')

    // Should show some loading indication (if implemented)
    await page.waitForSelector('[data-testid="horse-item"]', { timeout: 10000 })

    // Generate schedule
    await page.click('text=Generate Schedule')
    await page.waitForSelector('[role="tab"]', { timeout: 5000 })
  })

  test('should handle error states gracefully', async ({ page }) => {
    // Try to generate schedule without horses
    await page.click('text=Generate Schedule')

    // Should show error or remain in same state
    await expect(page.locator('h2')).toContainText('Ready to Race?')
  })

  test('should be responsive on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })

    // Verify layout adapts
    await expect(page.locator('h1')).toBeVisible()
    await expect(page.locator('[data-testid="generate-horses-button"]')).toBeVisible()

    // Generate horses
    await page.click('[data-testid="generate-horses-button"]')
    await page.waitForSelector('[data-testid="horse-item"]')

    // Verify mobile layout
    await expect(page.locator('h2')).toContainText('Horses')
  })

  test('should handle keyboard navigation', async ({ page }) => {
    // Focus on generate button
    await page.focus('[data-testid="generate-horses-button"]')

    // Press Enter to generate horses
    await page.keyboard.press('Enter')
    await page.waitForSelector('[data-testid="horse-item"]')

    // Tab to schedule button
    await page.keyboard.press('Tab')
    await page.keyboard.press('Enter')
    await page.waitForSelector('[role="tab"]')
  })

  test('should show race results correctly', async ({ page }) => {
    // Generate horses and schedule
    await page.click('[data-testid="generate-horses-button"]')
    await page.waitForSelector('[data-testid="horse-item"]')
    await page.click('text=Generate Schedule')
    await page.waitForSelector('[role="tab"]')

    // Start and complete a race
    await page.click('[role="tab"]:first-child')
    await page.click('text=Start Race')
    await page.waitForSelector('text=Race Completed', { timeout: 15000 })

    // Verify results table structure
    await expect(page.locator('th:has-text("Position")')).toBeVisible()
    await expect(page.locator('th:has-text("Horse")')).toBeVisible()
    await expect(page.locator('th:has-text("Time")')).toBeVisible()
    await expect(page.locator('th:has-text("Speed")')).toBeVisible()

    // Verify results data
    const resultRows = page.locator('tbody tr')
    await expect(resultRows).toHaveCount(10) // 10 horses per race
  })
})
