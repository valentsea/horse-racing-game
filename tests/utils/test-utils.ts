import { createPinia, setActivePinia } from 'pinia'
import { mount, type VueWrapper } from '@vue/test-utils'
import { vi } from 'vitest'
import type { Component } from 'vue'

/**
 * Test utilities for Vue components
 */
export class TestUtils {
  /**
   * Setup Pinia for testing
   */
  static setupPinia() {
    setActivePinia(createPinia())
  }

  /**
   * Mount component with Pinia store
   */
  static mountWithPinia<T extends Component>(component: T, options: any = {}): VueWrapper<any> {
    this.setupPinia()

    return mount(component, {
      global: {
        plugins: [createPinia()],
      },
      ...options,
    })
  }

  /**
   * Create mock store
   */
  static createMockStore(overrides: any = {}) {
    return {
      horses: [],
      races: [],
      gameState: 'idle',
      currentRaceIndex: 0,
      raceResults: [],
      isRaceInProgress: false,
      generateGameHorses: vi.fn(),
      generateRaceSchedule: vi.fn(),
      runSingleRace: vi.fn(),
      runSingleRound: vi.fn(),
      startRaces: vi.fn(),
      resetSingleRound: vi.fn(),
      resetAllRounds: vi.fn(),
      resetGame: vi.fn(),
      getHorseById: vi.fn(),
      ...overrides,
    }
  }

  /**
   * Create mock horse
   */
  static createMockHorse(overrides: any = {}) {
    return {
      id: 1,
      name: 'Test Horse',
      color: 'red',
      condition: 80,
      ...overrides,
    }
  }

  /**
   * Create mock race
   */
  static createMockRace(overrides: any = {}) {
    return {
      id: 1,
      distance: 1200,
      horses: [this.createMockHorse()],
      state: 'pending',
      results: undefined,
      actualDuration: 0,
      ...overrides,
    }
  }

  /**
   * Wait for async operations
   */
  static async waitFor(ms: number = 100) {
    await new Promise((resolve) => setTimeout(resolve, ms))
  }

  /**
   * Mock console methods
   */
  static mockConsole() {
    return {
      log: vi.spyOn(console, 'log').mockImplementation(() => {}),
      warn: vi.spyOn(console, 'warn').mockImplementation(() => {}),
      error: vi.spyOn(console, 'error').mockImplementation(() => {}),
      debug: vi.spyOn(console, 'debug').mockImplementation(() => {}),
    }
  }
}

/**
 * Test data factories
 */
export const TestData = {
  horses: (count: number = 5) =>
    Array.from({ length: count }, (_, i) =>
      TestUtils.createMockHorse({
        id: i + 1,
        name: `Horse ${i + 1}`,
      }),
    ),

  races: (count: number = 3) =>
    Array.from({ length: count }, (_, i) =>
      TestUtils.createMockRace({
        id: i + 1,
        distance: 1200 + i * 200,
      }),
    ),

  raceResults: (horseCount: number = 10) =>
    Array.from({ length: horseCount }, (_, i) => ({
      horseId: i + 1,
      position: i + 1,
      time: 10 + i * 0.5,
      horse: TestUtils.createMockHorse({ id: i + 1, name: `Horse ${i + 1}` }),
      speed: 120 - i * 5,
      distance: 1200,
      gap: i * 0.5,
    })),
}

/**
 * Test assertions helpers
 */
export const TestAssertions = {
  /**
   * Assert component renders without errors
   */
  rendersWithoutErrors: (wrapper: VueWrapper<any>) => {
    expect(wrapper.exists()).toBe(true)
    expect(wrapper.html()).toBeTruthy()
  },

  /**
   * Assert component has correct props
   */
  hasCorrectProps: (wrapper: VueWrapper<any>, expectedProps: Record<string, any>) => {
    Object.entries(expectedProps).forEach(([key, value]) => {
      expect(wrapper.props(key)).toBe(value)
    })
  },

  /**
   * Assert component emits correct events
   */
  emitsCorrectEvents: (wrapper: VueWrapper<any>, eventName: string, expectedPayload?: any) => {
    const emittedEvents = wrapper.emitted(eventName)
    expect(emittedEvents).toBeTruthy()
    if (expectedPayload !== undefined) {
      expect(emittedEvents?.[0]).toEqual([expectedPayload])
    }
  },

  /**
   * Assert component shows loading state
   */
  showsLoadingState: (wrapper: VueWrapper<any>) => {
    expect(wrapper.find('[data-testid="loading"]').exists()).toBe(true)
  },

  /**
   * Assert component shows error state
   */
  showsErrorState: (wrapper: VueWrapper<any>, errorMessage?: string) => {
    expect(wrapper.find('[data-testid="error"]').exists()).toBe(true)
    if (errorMessage) {
      expect(wrapper.find('[data-testid="error"]').text()).toContain(errorMessage)
    }
  },
}
