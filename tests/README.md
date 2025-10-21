# 🧪 Testing Guide

This document provides comprehensive information about the testing infrastructure for the Horse Racing Game.

## 📋 Test Structure

```
tests/
├── setup.ts                 # Global test setup
├── utils/
│   └── test-utils.ts        # Test utilities and helpers
├── unit/
│   ├── stores/
│   │   └── gameStore.test.ts    # Game store unit tests
│   ├── utils/
│   │   └── horseGenerator.test.ts  # Utility function tests
│   └── components/
│       └── components.test.ts     # Component unit tests
└── e2e/
    ├── game-flow.spec.ts         # Complete game flow E2E tests
    └── ui-components.spec.ts     # UI component E2E tests
```

## 🚀 Running Tests

### Unit Tests

```bash
# Run all unit tests
npm run test:unit

# Run unit tests with UI
npm run test:unit:ui

# Run unit tests with coverage
npm run test:unit:coverage

# Run specific test file
npm run test:unit tests/unit/stores/gameStore.test.ts

# Run tests in watch mode
npm run test:unit -- --watch
```

### E2E Tests

```bash
# Run all E2E tests
npm run test:e2e

# Run E2E tests with UI
npm run test:e2e:ui

# Run E2E tests in headed mode (visible browser)
npm run test:e2e:headed

# Run specific E2E test file
npm run test:e2e tests/e2e/game-flow.spec.ts

# Run tests on specific browser
npm run test:e2e -- --project=chromium
```

### All Tests

```bash
# Run both unit and E2E tests
npm run test:all
```

## 📊 Test Coverage

The project aims for **80%+ test coverage** across:

- **Branches**: 80%
- **Functions**: 80%
- **Lines**: 80%
- **Statements**: 80%

### Coverage Reports

Coverage reports are generated in the `coverage/` directory:

- **HTML Report**: `coverage/index.html`
- **JSON Report**: `coverage/coverage-final.json`
- **Text Report**: Console output

## 🧩 Unit Tests

### Game Store Tests

Tests for the main Pinia store (`src/stores/gameStore.ts`):

- ✅ Initial state validation
- ✅ Horse generation
- ✅ Race schedule generation
- ✅ Race execution (single and all)
- ✅ Race reset functionality
- ✅ Game reset functionality
- ✅ Computed properties
- ✅ Error handling

### Utility Function Tests

Tests for utility functions (`src/utils/`):

- ✅ Horse generation (`horseGenerator.ts`)
- ✅ Error handling (`errors.ts`)
- ✅ Validation utilities
- ✅ Logger functionality

### Component Tests

Tests for Vue components (`src/components/`):

- ✅ Component rendering
- ✅ Props validation
- ✅ Event emission
- ✅ User interactions
- ✅ State management integration

## 🎭 E2E Tests

### Game Flow Tests

Complete user journey tests (`tests/e2e/game-flow.spec.ts`):

- ✅ Full game flow (generate horses → schedule → race → results)
- ✅ Individual race execution
- ✅ Race reset functionality
- ✅ Game reset functionality
- ✅ Error handling
- ✅ Mobile responsiveness
- ✅ Keyboard navigation

### UI Component Tests

UI-specific tests (`tests/e2e/ui-components.spec.ts`):

- ✅ Initial UI state
- ✅ Component visibility
- ✅ Button states
- ✅ Loading states
- ✅ Error states
- ✅ Accessibility
- ✅ Responsive design

## 🛠️ Test Utilities

### TestUtils Class

The `TestUtils` class provides helper methods:

```typescript
// Setup Pinia for testing
TestUtils.setupPinia()

// Mount component with Pinia
const wrapper = TestUtils.mountWithPinia(MyComponent)

// Create mock store
const mockStore = TestUtils.createMockStore({ horses: [] })

// Create mock data
const mockHorse = TestUtils.createMockHorse({ name: 'Thunder' })
const mockRace = TestUtils.createMockRace({ distance: 1200 })
```

### TestData Factories

Factory functions for creating test data:

```typescript
// Create multiple horses
const horses = TestData.horses(10)

// Create multiple races
const races = TestData.races(6)

// Create race results
const results = TestData.raceResults(10)
```

### TestAssertions Helpers

Helper functions for common assertions:

```typescript
// Assert component renders without errors
TestAssertions.rendersWithoutErrors(wrapper)

// Assert component has correct props
TestAssertions.hasCorrectProps(wrapper, { variant: 'primary' })

// Assert component emits events
TestAssertions.emitsCorrectEvents(wrapper, 'click', { id: 1 })
```

## 🔧 Test Configuration

### Vitest Configuration

```typescript
// vitest.config.ts
export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./tests/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      thresholds: {
        global: {
          branches: 80,
          functions: 80,
          lines: 80,
          statements: 80,
        },
      },
    },
  },
})
```

### Playwright Configuration

```typescript
// playwright.config.ts
export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  retries: process.env.CI ? 2 : 0,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
  ],
})
```

## 📝 Writing Tests

### Unit Test Example

```typescript
import { describe, it, expect, beforeEach } from 'vitest'
import { TestUtils } from '../utils/test-utils'
import MyComponent from '@/components/MyComponent.vue'

describe('MyComponent', () => {
  let wrapper: VueWrapper<any>

  beforeEach(() => {
    wrapper = TestUtils.mountWithPinia(MyComponent, {
      props: { variant: 'primary' },
    })
  })

  it('should render correctly', () => {
    TestAssertions.rendersWithoutErrors(wrapper)
    expect(wrapper.find('button').exists()).toBe(true)
  })

  it('should emit click event', async () => {
    await wrapper.find('button').trigger('click')
    TestAssertions.emitsCorrectEvents(wrapper, 'click')
  })
})
```

### E2E Test Example

```typescript
import { test, expect } from '@playwright/test'

test.describe('My Feature', () => {
  test('should complete user flow', async ({ page }) => {
    await page.goto('/')

    // Interact with page
    await page.click('[data-testid="my-button"]')

    // Assert results
    await expect(page.locator('text=Success')).toBeVisible()
  })
})
```

## 🐛 Debugging Tests

### Unit Test Debugging

```bash
# Run specific test with verbose output
npm run test:unit -- --reporter=verbose tests/unit/stores/gameStore.test.ts

# Run tests with debugger
npm run test:unit -- --inspect-brk
```

### E2E Test Debugging

```bash
# Run tests in headed mode to see browser
npm run test:e2e:headed

# Run specific test in debug mode
npm run test:e2e -- --debug tests/e2e/game-flow.spec.ts

# Run tests with trace
npm run test:e2e -- --trace on
```

## 📈 Best Practices

### Unit Testing

1. **Test Behavior, Not Implementation**: Focus on what the code does, not how it does it
2. **Use Descriptive Test Names**: Clear, specific test descriptions
3. **Arrange-Act-Assert**: Structure tests with clear sections
4. **Mock External Dependencies**: Isolate the code under test
5. **Test Edge Cases**: Include boundary conditions and error scenarios

### E2E Testing

1. **Test User Journeys**: Focus on complete user workflows
2. **Use Data Test IDs**: Prefer `data-testid` over CSS selectors
3. **Wait for Elements**: Use proper waiting strategies
4. **Test Across Browsers**: Ensure compatibility
5. **Keep Tests Independent**: Each test should be able to run alone

### Test Maintenance

1. **Update Tests with Code Changes**: Keep tests in sync with implementation
2. **Refactor Test Code**: Apply same quality standards to test code
3. **Monitor Test Performance**: Keep test execution time reasonable
4. **Review Test Coverage**: Ensure adequate coverage of critical paths
5. **Document Test Scenarios**: Explain complex test cases

## 🚨 Common Issues

### Unit Test Issues

- **Mock Not Working**: Ensure mocks are set up before imports
- **Pinia Store Issues**: Use `setActivePinia(createPinia())` in setup
- **Async Operations**: Use `await` for async operations in tests
- **Component Not Mounting**: Check component imports and dependencies

### E2E Test Issues

- **Element Not Found**: Use proper selectors and waiting strategies
- **Race Conditions**: Use `waitForSelector` instead of `waitForTimeout`
- **Browser Issues**: Ensure Playwright browsers are installed
- **Port Conflicts**: Check if dev server is running on correct port

## 📚 Resources

- [Vitest Documentation](https://vitest.dev/)
- [Playwright Documentation](https://playwright.dev/)
- [Vue Test Utils](https://test-utils.vuejs.org/)
- [Testing Library](https://testing-library.com/)

---

**Happy Testing! 🎉**
