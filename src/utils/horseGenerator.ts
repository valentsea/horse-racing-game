/**
 * Horse Generation and Race Simulation Utilities
 *
 * This module provides functions for generating horses with random properties,
 * selecting horses for races, and simulating race outcomes with realistic physics.
 *
 * @fileoverview Core game logic for horse generation and race simulation
 * @author Horse Racing Game Team
 * @version 1.0.0
 */

import type { Horse, RaceSimulationResult } from '../types/horse'
import { RACE_CONSTANTS } from '../config/gameConfig'

// ==================== CONSTANTS ====================

/** Predefined horse names for variety and realism */
const HORSE_NAMES = [
  'Thunder',
  'Lightning',
  'Storm',
  'Blaze',
  'Shadow',
  'Midnight',
  'Sunrise',
  'Sunset',
  'Phoenix',
  'Dragon',
  'Eagle',
  'Falcon',
  'Comet',
  'Meteor',
  'Star',
  'Moon',
  'River',
  'Ocean',
  'Mountain',
  'Forest',
  'Desert',
  'Valley',
  'Canyon',
  'Meadow',
  'Spirit',
  'Soul',
  'Heart',
  'Courage',
  'Victory',
  'Champion',
  'Legend',
  'Hero',
  'Fire',
  'Ice',
  'Wind',
  'Earth',
  'Sky',
  'Cloud',
  'Rain',
  'Snow',
]

/** Predefined colors for horses (distinct and visually appealing) */
const HORSE_COLORS = [
  { name: 'Saddle Brown', value: '#8B4513' },
  { name: 'Sienna', value: '#A0522D' },
  { name: 'Peru', value: '#CD853F' },
  { name: 'Chocolate', value: '#D2691E' },
  { name: 'Fire Brick', value: '#B22222' },
  { name: 'Crimson', value: '#DC143C' },
  { name: 'Tomato', value: '#FF6347' },
  { name: 'Orange Red', value: '#FF4500' },
  { name: 'Dark Orange', value: '#FF8C00' },
  { name: 'Orange', value: '#FFA500' },
  { name: 'Gold', value: '#FFD700' },
  { name: 'Dark Golden Rod', value: '#B8860B' },
  { name: 'Golden Rod', value: '#DAA520' },
  { name: 'Purple', value: '#800080' },
  { name: 'Indigo', value: '#4B0082' },
  { name: 'Blue', value: '#0000FF' },
  { name: 'Navy', value: '#000080' },
  { name: 'Teal', value: '#008080' },
  { name: 'Green', value: '#008000' },
  { name: 'Lime', value: '#00FF00' },
]

// ==================== UTILITY FUNCTIONS ====================

/**
 * Generates a random horse name from the predefined list
 * @returns A random horse name
 */
function generateHorseName(): string {
  return HORSE_NAMES[Math.floor(Math.random() * HORSE_NAMES.length)]!
}

/**
 * Generates a random condition score between 1 and 100
 * Higher condition means better performance
 * @returns Random condition score (1-100)
 */
function generateCondition(): number {
  return Math.floor(Math.random() * 100) + 1
}

/**
 * Gets a unique color for a horse based on its index
 * Cycles through available colors to ensure variety
 * @param index - The horse's index (0-based)
 * @returns Color object with name and hex value
 */
function getHorseColor(index: number): { name: string; value: string } {
  return HORSE_COLORS[index % HORSE_COLORS.length]!
}

// ==================== EXPORTED FUNCTIONS ====================

/**
 * Generates a single horse with unique properties
 *
 * Creates a horse with a unique ID, random name, assigned color,
 * and random condition score.
 *
 * @param id - Unique identifier for the horse (1-based)
 * @returns Complete Horse object with all properties
 */
export function generateHorse(id: number): Horse {
  return {
    id,
    name: generateHorseName(),
    color: getHorseColor(id - 1), // id starts from 1, array index from 0
    condition: generateCondition(),
  }
}

/**
 * Generates a specified number of horses for the game
 *
 * Creates horses with sequential IDs and ensures each has
 * unique properties (name, color, condition).
 *
 * @param horseNumber - Number of horses to generate (default: 20)
 * @returns Array of generated Horse objects
 */
export function generateHorses(horseNumber: number = 20): Horse[] {
  const horses: Horse[] = []

  for (let i = 1; i <= horseNumber; i++) {
    horses.push(generateHorse(i))
  }

  return horses
}

/**
 * Selects random horses from the available horses for a race
 * Uses Fisher-Yates shuffle algorithm for better randomization
 */
export function selectRandomHorses(horses: Horse[], count: number = 10): Horse[] {
  if (horses.length <= count) {
    return [...horses]
  }

  // Create a copy of the horses array
  const shuffled = [...horses]

  // Fisher-Yates shuffle algorithm
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    const temp = shuffled[i]!
    shuffled[i] = shuffled[j]!
    shuffled[j] = temp
  }

  return shuffled.slice(0, count)
}

/**
 * Selects different random horses for multiple races, ensuring no overlap
 * Returns an array of horse arrays, one for each race
 */
export function selectDifferentHorsesForRaces(
  horses: Horse[],
  racesCount: number,
  horsesPerRace: number = 10,
): Horse[][] {
  if (horses.length < horsesPerRace) {
    throw new Error(
      `Not enough horses. Need at least ${horsesPerRace} horses, but only have ${horses.length}`,
    )
  }

  const totalHorsesNeeded = racesCount * horsesPerRace
  if (horses.length < totalHorsesNeeded) {
    // If we don't have enough horses for completely different sets,
    // we'll use a different strategy to minimize overlap
    return selectHorsesWithMinimalOverlap(horses, racesCount, horsesPerRace)
  }

  // We have enough horses for completely different sets
  const shuffled = [...horses]
  const raceHorses: Horse[][] = []

  // Shuffle all horses first
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    const temp = shuffled[i]!
    shuffled[i] = shuffled[j]!
    shuffled[j] = temp
  }

  // Assign different horses to each race
  for (let raceIndex = 0; raceIndex < racesCount; raceIndex++) {
    const startIndex = raceIndex * horsesPerRace
    const endIndex = startIndex + horsesPerRace
    raceHorses.push(shuffled.slice(startIndex, endIndex))
  }

  return raceHorses
}

/**
 * Selects horses for races with minimal overlap when we don't have enough horses
 * for completely different sets
 */
function selectHorsesWithMinimalOverlap(
  horses: Horse[],
  racesCount: number,
  horsesPerRace: number,
): Horse[][] {
  const raceHorses: Horse[][] = []
  const usedHorses = new Set<number>()

  for (let raceIndex = 0; raceIndex < racesCount; raceIndex++) {
    let availableHorses = horses.filter((horse) => !usedHorses.has(horse.id))

    // If we don't have enough unused horses, reset the used set
    if (availableHorses.length < horsesPerRace) {
      usedHorses.clear()
      availableHorses = [...horses] // Reset to all horses
    }

    // Select horses for this race
    const selectedHorses = selectRandomHorses(availableHorses, horsesPerRace)
    raceHorses.push(selectedHorses)

    // Mark these horses as used
    selectedHorses.forEach((horse) => usedHorses.add(horse.id))
  }

  return raceHorses
}

/**
 * Simulates a race and returns results with positions and times
 */
export function simulateRace(horses: Horse[], distance: number): RaceSimulationResult[] {
  const results = horses.map((horse) => {
    // Base time calculation: higher condition = faster time
    // Add randomness to make races unpredictable
    const baseTime =
      (distance / RACE_CONSTANTS.DISTANCE_CONVERSION_FACTOR) *
      (RACE_CONSTANTS.BASE_CONDITION_FACTOR - horse.condition)
    const randomFactor =
      RACE_CONSTANTS.RANDOM_FACTOR_MIN +
      Math.random() * (RACE_CONSTANTS.RANDOM_FACTOR_MAX - RACE_CONSTANTS.RANDOM_FACTOR_MIN)
    const time = baseTime * randomFactor

    const speed = distance / time // Speed in m/s

    return {
      horseId: horse.id,
      position: 0, // Will be set after sorting
      time: Math.round(time * 100) / 100, // Round to 2 decimal places
      horse: {
        id: horse.id,
        name: horse.name,
        color: horse.color,
        condition: horse.condition,
      },
      speed: Math.round(speed * 100) / 100, // Round to 2 decimal places
      distance: distance,
      gap: 0, // Will be set after sorting
    }
  })

  // Sort by time (fastest first) and assign positions
  results.sort((a, b) => a.time - b.time)

  // Apply proportional time scaling if any horse exceeds max time
  const slowestTime = results[results.length - 1]?.time || 0

  if (slowestTime > RACE_CONSTANTS.MAX_RACE_TIME_SECONDS) {
    // Calculate scaling factor to bring slowest horse to max time
    const scaleFactor = RACE_CONSTANTS.MAX_RACE_TIME_SECONDS / slowestTime

    // Apply scaling to all horses to maintain relative differences
    results.forEach((result) => {
      result.time = Math.round(result.time * scaleFactor * 100) / 100
      result.speed = Math.round((result.distance / result.time) * 100) / 100
    })
  }

  results.forEach((result, index) => {
    result.position = index + 1
    // Calculate gap behind winner
    if (index === 0) {
      result.gap = 0 // Winner has no gap
    } else {
      result.gap = Math.round((result.time - results[0]!.time) * 100) / 100
    }
  })

  return results
}
