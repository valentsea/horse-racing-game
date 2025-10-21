import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useGameStore } from '@/stores/gameStore'
import type { Horse, Race } from '@/types/horse'

// Mock the horse generator
vi.mock('@/utils/horseGenerator', () => ({
  generateHorses: vi.fn((count: number) => {
    return Array.from({ length: count }, (_, i) => ({
      id: i + 1,
      name: `Horse ${i + 1}`,
      color: `color-${i + 1}`,
      condition: 50 + Math.random() * 50,
    }))
  }),
  simulateRace: vi.fn(() => [
    {
      horseId: 1,
      position: 1,
      time: 10.5,
      horse: { id: 1, name: 'Horse 1', color: 'color-1', condition: 75 },
      speed: 120,
      distance: 1200,
      gap: 0,
    },
    {
      horseId: 2,
      position: 2,
      time: 11.0,
      horse: { id: 2, name: 'Horse 2', color: 'color-2', condition: 70 },
      speed: 109,
      distance: 1200,
      gap: 0.5,
    },
    {
      horseId: 3,
      position: 3,
      time: 11.5,
      horse: { id: 3, name: 'Horse 3', color: 'color-3', condition: 65 },
      speed: 104,
      distance: 1200,
      gap: 1.0,
    },
    {
      horseId: 4,
      position: 4,
      time: 12.0,
      horse: { id: 4, name: 'Horse 4', color: 'color-4', condition: 60 },
      speed: 100,
      distance: 1200,
      gap: 1.5,
    },
    {
      horseId: 5,
      position: 5,
      time: 12.5,
      horse: { id: 5, name: 'Horse 5', color: 'color-5', condition: 55 },
      speed: 96,
      distance: 1200,
      gap: 2.0,
    },
    {
      horseId: 6,
      position: 6,
      time: 13.0,
      horse: { id: 6, name: 'Horse 6', color: 'color-6', condition: 50 },
      speed: 92,
      distance: 1200,
      gap: 2.5,
    },
    {
      horseId: 7,
      position: 7,
      time: 13.5,
      horse: { id: 7, name: 'Horse 7', color: 'color-7', condition: 45 },
      speed: 89,
      distance: 1200,
      gap: 3.0,
    },
    {
      horseId: 8,
      position: 8,
      time: 14.0,
      horse: { id: 8, name: 'Horse 8', color: 'color-8', condition: 40 },
      speed: 86,
      distance: 1200,
      gap: 3.5,
    },
    {
      horseId: 9,
      position: 9,
      time: 14.5,
      horse: { id: 9, name: 'Horse 9', color: 'color-9', condition: 35 },
      speed: 83,
      distance: 1200,
      gap: 4.0,
    },
    {
      horseId: 10,
      position: 10,
      time: 15.0,
      horse: { id: 10, name: 'Horse 10', color: 'color-10', condition: 30 },
      speed: 80,
      distance: 1200,
      gap: 4.5,
    },
  ]),
  selectDifferentHorsesForRaces: vi.fn(
    (horses: any[], raceCount: number, horsesPerRace: number) => {
      // Return enough horse arrays for all races
      return Array.from({ length: raceCount }, (_, raceIndex) => {
        const startIndex = raceIndex * horsesPerRace
        return horses.slice(startIndex, startIndex + horsesPerRace)
      })
    },
  ),
}))

// Mock the logger
vi.mock('@/utils/errors', () => ({
  Logger: {
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
    debug: vi.fn(),
  },
  Validator: {
    validateHorseCount: vi.fn(),
    validateRaceId: vi.fn(),
    validateHorseId: vi.fn(),
  },
  GameError: class GameError extends Error {
    constructor(
      message: string,
      public code: string,
    ) {
      super(message)
      this.name = 'GameError'
    }
  },
  RaceError: class RaceError extends Error {
    constructor(
      message: string,
      public code: string,
    ) {
      super(message)
      this.name = 'RaceError'
    }
  },
  HorseError: class HorseError extends Error {
    constructor(
      message: string,
      public code: string,
    ) {
      super(message)
      this.name = 'HorseError'
    }
  },
}))

describe('Game Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  describe('Initial State', () => {
    it('should have correct initial state', () => {
      const store = useGameStore()

      expect(store.horses).toEqual([])
      expect(store.races).toEqual([])
      expect(store.gameState).toBe('idle')
      expect(store.currentRaceIndex).toBe(0)
      expect(store.raceResults).toEqual([])
      expect(store.isRaceInProgress).toBe(false)
    })

    it('should have correct computed properties', () => {
      const store = useGameStore()

      expect(store.isGameReady).toBe(false)
      expect(store.currentRace).toBeUndefined()
      expect(store.allRacesCompleted).toBe(true) // Initially true when no races
      expect(store.completedRaces).toEqual([])
    })
  })

  describe('Horse Generation', () => {
    it('should generate horses successfully', async () => {
      const store = useGameStore()
      const horseCount = 20

      await store.generateGameHorses(horseCount)

      expect(store.horses).toHaveLength(horseCount)
      expect(store.horses[0]).toHaveProperty('id')
      expect(store.horses[0]).toHaveProperty('name')
      expect(store.horses[0]).toHaveProperty('color')
      expect(store.horses[0]).toHaveProperty('condition')
      expect(store.gameState).toBe('idle')
    })

    it('should handle horse generation with default count', async () => {
      const store = useGameStore()

      await store.generateGameHorses()

      expect(store.horses).toHaveLength(20) // Default count
    })

    it('should validate horse count', async () => {
      const store = useGameStore()

      // These should throw validation errors
      try {
        await store.generateGameHorses(0)
        expect.fail('Should have thrown error for 0 horses')
      } catch (error) {
        expect(error).toBeDefined()
      }

      try {
        await store.generateGameHorses(-1)
        expect.fail('Should have thrown error for negative horses')
      } catch (error) {
        expect(error).toBeDefined()
      }

      try {
        await store.generateGameHorses(101)
        expect.fail('Should have thrown error for too many horses')
      } catch (error) {
        expect(error).toBeDefined()
      }
    })
  })

  describe('Race Schedule Generation', () => {
    beforeEach(async () => {
      const store = useGameStore()
      await store.generateGameHorses(20)
    })

    it('should generate race schedule successfully', () => {
      const store = useGameStore()

      store.generateRaceSchedule()

      expect(store.races).toHaveLength(6) // Default race count
      expect(store.races[0]).toHaveProperty('id')
      expect(store.races[0]).toHaveProperty('distance')
      expect(store.races[0]).toHaveProperty('horses')
      expect(store.races[0]).toHaveProperty('state', 'pending')
      expect(store.races[0].horses).toHaveLength(10) // Max horses per race
    })

    it('should throw error when no horses available', () => {
      const store = useGameStore()
      store.horses = [] // Clear horses

      expect(() => store.generateRaceSchedule()).toThrow('No horses available')
    })

    it('should throw error when insufficient horses', () => {
      const store = useGameStore()
      store.horses = store.horses.slice(0, 5) // Only 5 horses

      expect(() => store.generateRaceSchedule()).toThrow('Not enough horses available')
    })
  })

  describe('Race Execution', () => {
    beforeEach(async () => {
      const store = useGameStore()
      await store.generateGameHorses(20)
      store.generateRaceSchedule()
    })

    it('should execute single race successfully', async () => {
      const store = useGameStore()
      const raceId = store.races[0].id

      // Mock setTimeout to avoid delays
      vi.spyOn(global, 'setTimeout').mockImplementation((fn) => {
        fn()
        return {} as NodeJS.Timeout
      })

      await store.runSingleRound(raceId)

      const race = store.races.find((r) => r.id === raceId)
      expect(race?.state).toBe('completed')
      expect(race?.results).toBeDefined()
      expect(race?.results).toHaveLength(10)
    }, 10000)

    it('should execute single round successfully', async () => {
      const store = useGameStore()
      const raceId = store.races[0].id

      // Mock setTimeout to avoid delays
      vi.spyOn(global, 'setTimeout').mockImplementation((fn) => {
        fn()
        return {} as NodeJS.Timeout
      })

      await store.runSingleRound(raceId)

      const race = store.races.find((r) => r.id === raceId)
      expect(race?.state).toBe('completed')
      expect(store.isRaceInProgress).toBe(false)
    }, 10000)

    it('should start all races sequentially', async () => {
      const store = useGameStore()

      // Mock setTimeout to avoid actual delays in tests
      vi.spyOn(global, 'setTimeout').mockImplementation((fn) => {
        fn()
        return {} as NodeJS.Timeout
      })

      await store.startRaces()

      // After starting all races, the current race index should be at the end
      expect(store.currentRaceIndex).toBe(store.races.length - 1)
      // All races should be completed
      expect(store.races.every(race => race.state === 'completed')).toBe(true)
    })

    it('should throw error for invalid race ID', async () => {
      const store = useGameStore()

      await expect(store.runSingleRound(999)).rejects.toThrow()
    })
  })

  describe('Race Reset', () => {
    beforeEach(async () => {
      const store = useGameStore()
      await store.generateGameHorses(20)
      store.generateRaceSchedule()
      await store.runSingleRound(store.races[0].id)
    })

    it('should reset single round', async () => {
      const store = useGameStore()
      const raceId = store.races[0].id

      await store.resetSingleRound(raceId)

      const race = store.races.find((r) => r.id === raceId)
      expect(race?.state).toBe('pending')
      expect(race?.results).toBeUndefined()
    })

    it('should reset all rounds', async () => {
      const store = useGameStore()

      await store.resetAllRounds()

      store.races.forEach((race) => {
        expect(race.state).toBe('pending')
        expect(race.results).toBeUndefined()
      })
      expect(store.gameState).toBe('idle')
      expect(store.isRaceInProgress).toBe(false)
    })
  })

  describe('Game Reset', () => {
    beforeEach(async () => {
      const store = useGameStore()
      await store.generateGameHorses(20)
      store.generateRaceSchedule()
    })

    it('should reset entire game', () => {
      const store = useGameStore()

      store.resetGame()

      expect(store.horses).toEqual([])
      expect(store.races).toEqual([])
      expect(store.gameState).toBe('idle')
      expect(store.currentRaceIndex).toBe(0)
      expect(store.raceResults).toEqual([])
      expect(store.isRaceInProgress).toBe(false)
    })
  })

  describe('Computed Properties', () => {
    it('should calculate isGameReady correctly', async () => {
      const store = useGameStore()

      // Initially not ready
      expect(store.isGameReady).toBe(false)

      // Generate horses but no races
      await store.generateGameHorses(20)
      expect(store.isGameReady).toBe(false)

      // Generate races
      store.generateRaceSchedule()
      expect(store.isGameReady).toBe(true)
    })

    it('should get current race correctly', async () => {
      const store = useGameStore()

      expect(store.currentRace).toBeUndefined()

      // Generate horses first
      await store.generateGameHorses(20)
      store.generateRaceSchedule()
      expect(store.currentRace).toBe(store.races[0])

      store.currentRaceIndex = 1
      expect(store.currentRace).toBe(store.races[1])
    })

    it('should check all races completed correctly', async () => {
      const store = useGameStore()

      expect(store.allRacesCompleted).toBe(true) // Initially true when no races

      // Generate horses first
      await store.generateGameHorses(20)
      store.generateRaceSchedule()
      expect(store.allRacesCompleted).toBe(false)

      store.currentRaceIndex = store.races.length
      expect(store.allRacesCompleted).toBe(true)
    })

    it('should get completed races correctly', async () => {
      const store = useGameStore()
      await store.generateGameHorses(20)
      store.generateRaceSchedule()

      expect(store.completedRaces).toEqual([])

      await store.runSingleRound(store.races[0].id)
      expect(store.completedRaces).toHaveLength(1)

      await store.runSingleRound(store.races[1].id)
      expect(store.completedRaces).toHaveLength(2)
    })
  })

  describe('Horse Lookup', () => {
    beforeEach(async () => {
      const store = useGameStore()
      await store.generateGameHorses(20)
      store.generateRaceSchedule()
    })

    it('should get horse by ID', () => {
      const store = useGameStore()
      const horse = store.horses[0]

      expect(store.getHorseById(horse.id)).toEqual(horse)
      expect(store.getHorseById(999)).toBeUndefined()
    })
  })
})
