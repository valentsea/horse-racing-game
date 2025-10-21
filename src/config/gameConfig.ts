import type { GameConfig } from '../types/horse'

/**
 * Game configuration with proper typing and validation
 */
export const GAME_CONFIG: GameConfig = {
  minHorsesForRace: 10,
  maxHorsesPerRace: 10,
  defaultHorsesGenerated: 20,
  raceDistances: [1200, 1400, 1600, 1800, 2000, 2200] as const,
  minRaceDuration: 2000,
  raceDelay: 5000,
} as const

/**
 * Race simulation constants
 */
export const RACE_CONSTANTS = {
  MAX_RACE_TIME_SECONDS: 5,
  BASE_CONDITION_FACTOR: 120,
  RANDOM_FACTOR_MIN: 0.8,
  RANDOM_FACTOR_MAX: 1.2,
  DISTANCE_CONVERSION_FACTOR: 1000,
} as const

/**
 * UI constants for consistent styling and behavior
 */
export const UI_CONSTANTS = {
  ANIMATION_DURATION: 150,
  DEBOUNCE_DELAY: 300,
  TOAST_DURATION: 3000,
  MODAL_Z_INDEX: 1000,
} as const

/**
 * Validation constants
 */
export const VALIDATION_CONSTANTS = {
  MIN_HORSE_COUNT: 1,
  MAX_HORSE_COUNT: 50,
  MIN_RACE_DISTANCE: 100,
  MAX_RACE_DISTANCE: 5000,
  MIN_HORSE_CONDITION: 1,
  MAX_HORSE_CONDITION: 100,
} as const

/**
 * Type-safe configuration getter
 */
export function getGameConfig(): Readonly<GameConfig> {
  return GAME_CONFIG
}

/**
 * Type-safe constant getters
 */
export function getRaceConstants() {
  return RACE_CONSTANTS
}

export function getUIConstants() {
  return UI_CONSTANTS
}

export function getValidationConstants() {
  return VALIDATION_CONSTANTS
}
