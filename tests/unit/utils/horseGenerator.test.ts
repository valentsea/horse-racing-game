import { describe, it, expect, beforeEach, vi } from 'vitest'
import { generateHorse, generateHorses, simulateRace } from '@/utils/horseGenerator'
import {
  GameError,
  ValidationError,
  RaceError,
  HorseError,
  Validator,
  Logger,
} from '@/utils/errors'
import type { Horse } from '@/types/horse'

describe('Horse Generator', () => {
  describe('generateHorse', () => {
    it('should generate a horse with correct properties', () => {
      const horse = generateHorse(1)

      expect(horse).toHaveProperty('id', 1)
      expect(horse).toHaveProperty('name')
      expect(horse).toHaveProperty('color')
      expect(horse).toHaveProperty('condition')
      expect(typeof horse.name).toBe('string')
      expect(typeof horse.color).toBe('object') // Color is an object with hex, name, etc.
      expect(typeof horse.condition).toBe('number')
      expect(horse.condition).toBeGreaterThanOrEqual(1)
      expect(horse.condition).toBeLessThanOrEqual(100)
    })

    it('should generate horses with unique IDs', () => {
      const horse1 = generateHorse(1)
      const horse2 = generateHorse(2)

      expect(horse1.id).toBe(1)
      expect(horse2.id).toBe(2)
      expect(horse1.id).not.toBe(horse2.id)
    })

    it('should generate horses with different names', () => {
      const horses = Array.from({ length: 10 }, (_, i) => generateHorse(i + 1))
      const names = horses.map((h) => h.name)
      const uniqueNames = new Set(names)

      expect(uniqueNames.size).toBeGreaterThan(1) // Should have some variety
    })
  })

  describe('generateHorses', () => {
    it('should generate correct number of horses', () => {
      const horses = generateHorses(5)

      expect(horses).toHaveLength(5)
      horses.forEach((horse, index) => {
        expect(horse.id).toBe(index + 1)
      })
    })

    it('should generate horses with default count', () => {
      const horses = generateHorses()

      expect(horses).toHaveLength(20) // Default count
    })

    it('should handle edge cases', () => {
      // The actual implementation might not throw for these cases
      // Let's test what actually happens
      const emptyHorses = generateHorses(0)
      expect(emptyHorses).toHaveLength(0)

      const negativeHorses = generateHorses(-1)
      expect(negativeHorses).toHaveLength(0)
    })
  })

  describe('simulateRace', () => {
    let horses: Horse[]

    beforeEach(() => {
      horses = [
        { id: 1, name: 'Fast Horse', color: 'red', condition: 90 },
        { id: 2, name: 'Slow Horse', color: 'blue', condition: 30 },
        { id: 3, name: 'Medium Horse', color: 'green', condition: 60 },
      ]
    })

    it('should simulate race with correct results structure', () => {
      const results = simulateRace(horses, 1200)

      expect(results).toHaveLength(3)
      results.forEach((result, index) => {
        expect(result).toHaveProperty('horseId')
        expect(result).toHaveProperty('position')
        expect(result).toHaveProperty('time')
        expect(result).toHaveProperty('horse')
        expect(result).toHaveProperty('speed')
        expect(result).toHaveProperty('distance', 1200)
        expect(result).toHaveProperty('gap')
        expect(result.position).toBe(index + 1)
      })
    })

    it('should rank horses by performance', () => {
      const results = simulateRace(horses, 1200)

      // Results should be sorted by time (fastest first)
      for (let i = 0; i < results.length - 1; i++) {
        expect(results[i].time).toBeLessThanOrEqual(results[i + 1].time)
      }
    })

    it('should calculate speed correctly', () => {
      const results = simulateRace(horses, 1200)

      results.forEach((result) => {
        const expectedSpeed = result.distance / result.time
        expect(result.speed).toBeCloseTo(expectedSpeed, 1)
      })
    })

    it('should calculate gaps correctly', () => {
      const results = simulateRace(horses, 1200)

      expect(results[0].gap).toBe(0) // Winner has no gap
      results.slice(1).forEach((result) => {
        expect(result.gap).toBeGreaterThan(0)
      })
    })

    it('should handle different distances', () => {
      const shortRace = simulateRace(horses, 800)
      const longRace = simulateRace(horses, 2000)

      expect(shortRace[0].distance).toBe(800)
      expect(longRace[0].distance).toBe(2000)

      // Both races should have valid times
      expect(shortRace[0].time).toBeGreaterThan(0)
      expect(longRace[0].time).toBeGreaterThan(0)
    })

    it('should have some randomness in results', () => {
      const results1 = simulateRace(horses, 1200)
      const results2 = simulateRace(horses, 1200)

      // Results should be different due to randomness
      const times1 = results1.map((r) => r.time)
      const times2 = results2.map((r) => r.time)

      expect(times1).not.toEqual(times2)
    })
  })
})

describe('Error Classes', () => {
  describe('GameError', () => {
    it('should create error with message and code', () => {
      const error = new GameError('Test error', 'TEST_CODE')

      expect(error.message).toBe('Test error')
      expect(error.code).toBe('TEST_CODE')
      expect(error.name).toBe('GameError')
    })

    it('should create error with context', () => {
      const context = { raceId: 1, horseId: 2 }
      const error = new GameError('Test error', 'TEST_CODE', context)

      expect(error.context).toEqual(context)
    })
  })

  describe('ValidationError', () => {
    it('should create validation error with field', () => {
      const error = new ValidationError('Invalid input', 'horseCount')

      expect(error.message).toBe('Invalid input')
      expect(error.code).toBe('VALIDATION_ERROR')
      expect(error.context?.field).toBe('horseCount')
    })
  })

  describe('RaceError', () => {
    it('should create race error with race ID', () => {
      const error = new RaceError('Race failed', 1)

      expect(error.message).toBe('Race failed')
      expect(error.code).toBe('RACE_ERROR')
      expect(error.context?.raceId).toBe(1)
    })
  })

  describe('HorseError', () => {
    it('should create horse error with horse ID', () => {
      const error = new HorseError('Horse not found', 1)

      expect(error.message).toBe('Horse not found')
      expect(error.code).toBe('HORSE_ERROR')
      expect(error.context?.horseId).toBe(1)
    })
  })
})

describe('Validator', () => {
  describe('validateHorseCount', () => {
    it('should validate correct horse count', () => {
      expect(() => Validator.validateHorseCount(20)).not.toThrow()
      expect(() => Validator.validateHorseCount(1)).not.toThrow()
      expect(() => Validator.validateHorseCount(50)).not.toThrow() // Within limits
    })

    it('should throw for invalid horse count', () => {
      expect(() => Validator.validateHorseCount(0)).toThrow(ValidationError)
      expect(() => Validator.validateHorseCount(-1)).toThrow(ValidationError)
      expect(() => Validator.validateHorseCount(101)).toThrow(ValidationError)
      expect(() => Validator.validateHorseCount(1.5)).toThrow(ValidationError)
    })
  })

  describe('validateRaceId', () => {
    it('should validate correct race ID', () => {
      expect(() => Validator.validateRaceId(1)).not.toThrow()
      expect(() => Validator.validateRaceId(10)).not.toThrow()
    })

    it('should throw for invalid race ID', () => {
      expect(() => Validator.validateRaceId(0)).toThrow(ValidationError)
      expect(() => Validator.validateRaceId(-1)).toThrow(ValidationError)
      expect(() => Validator.validateRaceId(1.5)).toThrow(ValidationError)
    })
  })

  describe('validateHorseId', () => {
    it('should validate correct horse ID', () => {
      expect(() => Validator.validateHorseId(1)).not.toThrow()
      expect(() => Validator.validateHorseId(10)).not.toThrow()
    })

    it('should throw for invalid horse ID', () => {
      expect(() => Validator.validateHorseId(0)).toThrow(ValidationError)
      expect(() => Validator.validateHorseId(-1)).toThrow(ValidationError)
      expect(() => Validator.validateHorseId(1.5)).toThrow(ValidationError)
    })
  })

  describe('validateRaceDistance', () => {
    it('should validate correct race distance', () => {
      expect(() => Validator.validateRaceDistance(100)).not.toThrow()
      expect(() => Validator.validateRaceDistance(1200)).not.toThrow()
      expect(() => Validator.validateRaceDistance(5000)).not.toThrow()
    })

    it('should throw for invalid race distance', () => {
      expect(() => Validator.validateRaceDistance(50)).toThrow(ValidationError)
      expect(() => Validator.validateRaceDistance(6000)).toThrow(ValidationError)
      expect(() => Validator.validateRaceDistance(-100)).toThrow(ValidationError)
      expect(() => Validator.validateRaceDistance(NaN)).toThrow(ValidationError)
      expect(() => Validator.validateRaceDistance(Infinity)).toThrow(ValidationError)
    })
  })

  describe('validateHorseCondition', () => {
    it('should validate correct horse condition', () => {
      expect(() => Validator.validateHorseCondition(1)).not.toThrow()
      expect(() => Validator.validateHorseCondition(50)).not.toThrow()
      expect(() => Validator.validateHorseCondition(100)).not.toThrow()
    })

    it('should throw for invalid horse condition', () => {
      expect(() => Validator.validateHorseCondition(0)).toThrow(ValidationError)
      expect(() => Validator.validateHorseCondition(101)).toThrow(ValidationError)
      expect(() => Validator.validateHorseCondition(-1)).toThrow(ValidationError)
      expect(() => Validator.validateHorseCondition(NaN)).toThrow(ValidationError)
      expect(() => Validator.validateHorseCondition(Infinity)).toThrow(ValidationError)
    })
  })
})

describe('Logger', () => {
  let consoleSpy: any

  beforeEach(() => {
    consoleSpy = {
      log: vi.spyOn(console, 'log').mockImplementation(() => {}),
      warn: vi.spyOn(console, 'warn').mockImplementation(() => {}),
      error: vi.spyOn(console, 'error').mockImplementation(() => {}),
      debug: vi.spyOn(console, 'debug').mockImplementation(() => {}),
    }
  })

  afterEach(() => {
    Object.values(consoleSpy).forEach((spy: any) => spy.mockRestore())
  })

  describe('info', () => {
    it('should not log in production', () => {
      // Mock production environment
      vi.stubEnv('DEV', 'false')

      Logger.info('Test message', { test: 'data' })

      expect(consoleSpy.log).not.toHaveBeenCalled()
    })
  })

  describe('warn', () => {
    it('should log warnings in development', () => {
      vi.stubEnv('DEV', 'true')

      Logger.warn('Test warning', { test: 'data' })

      expect(consoleSpy.warn).toHaveBeenCalledWith('[WARN] Test warning', { test: 'data' })
    })
  })

  describe('error', () => {
    it('should always log errors', () => {
      const error = new Error('Test error')

      Logger.error('Test error message', error, { test: 'data' })

      expect(consoleSpy.error).toHaveBeenCalledWith('[ERROR] Test error message', error, {
        test: 'data',
      })
    })
  })

  describe('debug', () => {
    it('should log debug messages in development', () => {
      vi.stubEnv('DEV', 'true')

      Logger.debug('Test debug', { test: 'data' })

      expect(consoleSpy.debug).toHaveBeenCalledWith('[DEBUG] Test debug', { test: 'data' })
    })
  })
})
