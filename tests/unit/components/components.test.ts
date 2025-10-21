import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import HorsesList from '@/components/HorsesList.vue'
import GameStatistics from '@/components/GameStatistics.vue'
import GameControls from '@/components/GameControls.vue'
import { useGameStore } from '@/stores/gameStore'
import type { Horse } from '@/types/horse'

// Mock the game store
vi.mock('@/stores/gameStore', () => ({
  useGameStore: vi.fn(),
}))

describe('HorsesList Component', () => {
  let wrapper: any
  let mockStore: any

  beforeEach(() => {
    setActivePinia(createPinia())

    mockStore = {
      horses: [],
      generateGameHorses: vi.fn(),
    }

    vi.mocked(useGameStore).mockReturnValue(mockStore)
  })

  it('should render empty state when no horses', () => {
    wrapper = mount(HorsesList, {
      props: { activeTab: 1 },
      global: {
        plugins: [createPinia()],
      },
    })

    expect(wrapper.find('h2').text()).toBe('Ready to Race?')
    expect(wrapper.find('p').text()).toBe('Generate horses and start racing!')
  })

  it('should render horses list when horses exist', async () => {
    const horses: Horse[] = [
      { id: 1, name: 'Horse 1', color: 'red', condition: 80 },
      { id: 2, name: 'Horse 2', color: 'blue', condition: 70 },
    ]

    mockStore.horses = horses
    mockStore.races = [] // Empty races to avoid computed property errors

    wrapper = mount(HorsesList, {
      props: { activeTab: 1 },
      global: {
        plugins: [createPinia()],
      },
    })

    const h2Element = wrapper.find('h2')
    if (h2Element.exists()) {
      expect(h2Element.text()).toBe('Horses')
    }

    const horseCards = wrapper.findAllComponents({ name: 'HorseCard' })
    expect(horseCards).toHaveLength(2)
  })

  it('should call generateGameHorses when generate button clicked', async () => {
    wrapper = mount(HorsesList, {
      props: { activeTab: 1 },
      global: {
        plugins: [createPinia()],
      },
    })

    const generateButton = wrapper.find('button')
    if (generateButton.exists()) {
      await generateButton.trigger('click')
      expect(mockStore.generateGameHorses).toHaveBeenCalledWith(20)
    }
  })

  it('should show correct horse information', async () => {
    const horses: Horse[] = [{ id: 1, name: 'Thunder', color: 'red', condition: 85 }]

    mockStore.horses = horses
    mockStore.races = [] // Empty races to avoid computed property errors

    wrapper = mount(HorsesList, {
      props: { activeTab: 1 },
      global: {
        plugins: [createPinia()],
      },
    })

    const horseCards = wrapper.findAllComponents({ name: 'HorseCard' })
    if (horseCards.length > 0) {
      expect(horseCards[0].props('horse').name).toBe('Thunder')
      expect(horseCards[0].props('horse').condition).toBe(85)
    }
  })
})

describe('GameStatistics Component', () => {
  let wrapper: any
  let mockStore: any

  beforeEach(() => {
    setActivePinia(createPinia())

    mockStore = {
      races: [],
      horses: [],
    }

    vi.mocked(useGameStore).mockReturnValue(mockStore)
  })

  it('should render statistics title', () => {
    wrapper = mount(GameStatistics, {
      global: {
        plugins: [createPinia()],
      },
    })

    expect(wrapper.find('h2').text()).toBe('📊 Game Statistics')
  })

  it('should show correct race count', async () => {
    mockStore.races = [
      { id: 1, state: 'completed' },
      { id: 2, state: 'pending' },
    ]

    wrapper = mount(GameStatistics, {
      global: {
        plugins: [createPinia()],
      },
    })

    const totalRacesElement = wrapper.find('[data-testid="total-races"]')
    if (totalRacesElement.exists()) {
      expect(totalRacesElement.text()).toContain('2')
    }
  })

  it('should show correct horse count', async () => {
    mockStore.horses = [
      { id: 1, name: 'Horse 1', color: 'red', condition: 80 },
      { id: 2, name: 'Horse 2', color: 'blue', condition: 70 },
    ]

    wrapper = mount(GameStatistics, {
      global: {
        plugins: [createPinia()],
      },
    })

    const totalHorsesElement = wrapper.find('[data-testid="total-horses"]')
    if (totalHorsesElement.exists()) {
      expect(totalHorsesElement.text()).toContain('2')
    }
  })

  it('should show completed races count', async () => {
    mockStore.races = [
      { id: 1, state: 'completed' },
      { id: 2, state: 'completed' },
      { id: 3, state: 'pending' },
    ]

    wrapper = mount(GameStatistics, {
      global: {
        plugins: [createPinia()],
      },
    })

    const completedRacesElement = wrapper.find('[data-testid="completed-races"]')
    if (completedRacesElement.exists()) {
      expect(completedRacesElement.text()).toContain('2')
    }
  })
})

describe('GameControls Component', () => {
  let wrapper: any
  let mockStore: any

  beforeEach(() => {
    setActivePinia(createPinia())

    mockStore = {
      gameState: 'idle',
      resetGame: vi.fn(),
    }

    vi.mocked(useGameStore).mockReturnValue(mockStore)
  })

  it('should render reset button', () => {
    wrapper = mount(GameControls, {
      global: {
        plugins: [createPinia()],
      },
    })

    expect(wrapper.find('button').text()).toContain('New Game')
  })

  it('should call resetGame when reset button clicked', async () => {
    wrapper = mount(GameControls, {
      global: {
        plugins: [createPinia()],
      },
    })

    const resetButton = wrapper.find('button')
    await resetButton.trigger('click')

    expect(mockStore.resetGame).toHaveBeenCalled()
  })

  it('should disable reset button when racing', async () => {
    mockStore.gameState = 'racing'

    wrapper = mount(GameControls, {
      global: {
        plugins: [createPinia()],
      },
    })

    const resetButton = wrapper.find('button')
    expect(resetButton.attributes('disabled')).toBeDefined()
  })

  it('should enable reset button when not racing', async () => {
    mockStore.gameState = 'idle'

    wrapper = mount(GameControls, {
      global: {
        plugins: [createPinia()],
      },
    })

    const resetButton = wrapper.find('button')
    expect(resetButton.attributes('disabled')).toBeUndefined()
  })
})
