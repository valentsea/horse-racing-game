import { describe, it, expect } from 'vitest'
import {
  generateHorse,
  generateHorses,
  selectRandomHorses,
  simulateRace,
} from '../utils/horseGenerator'
import type { Horse } from '../types/horse'

describe('Horse Generation', () => {
  it('should generate a horse with valid properties', () => {
    const horse = generateHorse(1)

    expect(horse).toHaveProperty('id', 1)
    expect(horse).toHaveProperty('name')
    expect(horse).toHaveProperty('color')
    expect(horse).toHaveProperty('condition')
    expect(typeof horse.name).toBe('string')
    expect(typeof horse.color).toBe('object')
    expect(horse.color).toHaveProperty('name')
    expect(horse.color).toHaveProperty('value')
    expect(typeof horse.color.name).toBe('string')
    expect(typeof horse.color.value).toBe('string')
    expect(typeof horse.condition).toBe('number')
    expect(horse.condition).toBeGreaterThanOrEqual(1)
    expect(horse.condition).toBeLessThanOrEqual(100)
  })

  it('should generate exactly 20 horses', () => {
    const horses = generateHorses()

    expect(horses).toHaveLength(20)
    expect(horses.every((horse) => horse.id >= 1 && horse.id <= 20)).toBe(true)
  })

  it('should generate horses with unique IDs', () => {
    const horses = generateHorses()
    const ids = horses.map((horse) => horse.id)
    const uniqueIds = new Set(ids)

    expect(uniqueIds.size).toBe(20)
  })

  it('should generate horses with valid condition scores', () => {
    const horses = generateHorses()

    horses.forEach((horse) => {
      expect(horse.condition).toBeGreaterThanOrEqual(1)
      expect(horse.condition).toBeLessThanOrEqual(100)
    })
  })
})

describe('Horse Selection', () => {
  it('should select random horses from available horses', () => {
    const horses = generateHorses()
    const selected = selectRandomHorses(horses, 10)

    expect(selected).toHaveLength(10)
    expect(selected.every((horse) => horses.includes(horse))).toBe(true)
  })

  it('should return all horses if count exceeds available horses', () => {
    const horses = generateHorses().slice(0, 5)
    const selected = selectRandomHorses(horses, 10)

    expect(selected).toHaveLength(5)
    expect(selected).toEqual(horses)
  })
})

describe('Race Simulation', () => {
  it('should simulate a race with valid results', () => {
    const horses = generateHorses().slice(0, 5)
    const distance = 1200
    const results = simulateRace(horses, distance)

    expect(results).toHaveLength(5)
    results.forEach((result) => {
      expect(result).toHaveProperty('horseId')
      expect(result).toHaveProperty('position')
      expect(result).toHaveProperty('time')
      expect(typeof result.time).toBe('number')
      expect(result.time).toBeGreaterThan(0)
    })
  })

  it('should assign correct positions (1-based)', () => {
    const horses = generateHorses().slice(0, 3)
    const results = simulateRace(horses, 1200)

    const positions = results.map((r) => r.position).sort()
    expect(positions).toEqual([1, 2, 3])
  })

  it('should have faster horses with higher condition scores', () => {
    const horses: Horse[] = [
      { id: 1, name: 'Fast', color: { name: 'Black', value: '#000000' }, condition: 90 },
      { id: 2, name: 'Slow', color: { name: 'White', value: '#FFFFFF' }, condition: 10 },
    ]

    const results = simulateRace(horses, 1200)
    const fastHorseResult = results.find((r) => r.horseId === 1)
    const slowHorseResult = results.find((r) => r.horseId === 2)

    expect(fastHorseResult!.time).toBeLessThan(slowHorseResult!.time)
  })
})
