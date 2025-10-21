import { beforeAll, afterEach, afterAll, vi } from 'vitest'
import { cleanup } from '@testing-library/vue'
import { setActivePinia, createPinia } from 'pinia'
import '@testing-library/jest-dom'

// Mock environment variables
vi.stubGlobal('import.meta', {
  env: {
    DEV: true,
    PROD: false,
  },
})

// Setup Pinia for testing
beforeAll(() => {
  setActivePinia(createPinia())
})

// Cleanup after each test
afterEach(() => {
  cleanup()
  vi.clearAllMocks()
})

// Global test setup
afterAll(() => {
  // Cleanup any global state if needed
})
