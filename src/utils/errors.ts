import { VALIDATION_CONSTANTS } from '../config/gameConfig'

/**
 * Custom error classes for better error handling
 */
export class GameError extends Error {
  constructor(
    message: string,
    public code: string,
    public context?: Record<string, unknown>,
  ) {
    super(message)
    this.name = 'GameError'
  }
}

export class ValidationError extends GameError {
  constructor(message: string, field?: string) {
    super(message, 'VALIDATION_ERROR', { field })
    this.name = 'ValidationError'
  }
}

export class RaceError extends GameError {
  constructor(message: string, raceId?: number) {
    super(message, 'RACE_ERROR', { raceId })
    this.name = 'RaceError'
  }
}

export class HorseError extends GameError {
  constructor(message: string, horseId?: number) {
    super(message, 'HORSE_ERROR', { horseId })
    this.name = 'HorseError'
  }
}

/**
 * Validation utilities with proper constants
 */
export class Validator {
  /**
   * Validate horse count for generation
   */
  static validateHorseCount(count: number): void {
    if (!Number.isInteger(count)) {
      throw new ValidationError('Horse count must be an integer')
    }
    if (count < VALIDATION_CONSTANTS.MIN_HORSE_COUNT) {
      throw new ValidationError(
        `Horse count must be at least ${VALIDATION_CONSTANTS.MIN_HORSE_COUNT}`,
      )
    }
    if (count > VALIDATION_CONSTANTS.MAX_HORSE_COUNT) {
      throw new ValidationError(`Horse count cannot exceed ${VALIDATION_CONSTANTS.MAX_HORSE_COUNT}`)
    }
  }

  /**
   * Validate race ID
   */
  static validateRaceId(raceId: number): void {
    if (!Number.isInteger(raceId)) {
      throw new ValidationError('Race ID must be an integer')
    }
    if (raceId < 1) {
      throw new ValidationError('Race ID must be positive')
    }
  }

  /**
   * Validate horse ID
   */
  static validateHorseId(horseId: number): void {
    if (!Number.isInteger(horseId)) {
      throw new ValidationError('Horse ID must be an integer')
    }
    if (horseId < 1) {
      throw new ValidationError('Horse ID must be positive')
    }
  }

  /**
   * Validate race distance
   */
  static validateRaceDistance(distance: number): void {
    if (!Number.isFinite(distance)) {
      throw new ValidationError('Race distance must be a finite number')
    }
    if (distance < VALIDATION_CONSTANTS.MIN_RACE_DISTANCE) {
      throw new ValidationError(
        `Race distance must be at least ${VALIDATION_CONSTANTS.MIN_RACE_DISTANCE} meters`,
      )
    }
    if (distance > VALIDATION_CONSTANTS.MAX_RACE_DISTANCE) {
      throw new ValidationError(
        `Race distance cannot exceed ${VALIDATION_CONSTANTS.MAX_RACE_DISTANCE} meters`,
      )
    }
  }

  /**
   * Validate horse condition
   */
  static validateHorseCondition(condition: number): void {
    if (!Number.isFinite(condition)) {
      throw new ValidationError('Horse condition must be a finite number')
    }
    if (condition < VALIDATION_CONSTANTS.MIN_HORSE_CONDITION) {
      throw new ValidationError(
        `Horse condition must be at least ${VALIDATION_CONSTANTS.MIN_HORSE_CONDITION}`,
      )
    }
    if (condition > VALIDATION_CONSTANTS.MAX_HORSE_CONDITION) {
      throw new ValidationError(
        `Horse condition cannot exceed ${VALIDATION_CONSTANTS.MAX_HORSE_CONDITION}`,
      )
    }
  }
}

/**
 * Logger utility for better debugging and monitoring
 */
export class Logger {
  private static isDevelopment = import.meta.env.DEV

  static info(_message: string, _context?: Record<string, unknown>): void {
    // INFO level logging disabled - only show warnings and errors
  }

  static warn(message: string, context?: Record<string, unknown>): void {
    if (this.isDevelopment) {
      console.warn(`[WARN] ${message}`, context || '')
    }
  }

  static error(message: string, error?: Error, context?: Record<string, unknown>): void {
    console.error(`[ERROR] ${message}`, error || '', context || '')
  }

  static debug(message: string, context?: Record<string, unknown>): void {
    if (this.isDevelopment) {
      console.debug(`[DEBUG] ${message}`, context || '')
    }
  }
}
