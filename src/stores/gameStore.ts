/**
 * Game Store - Central state management for the Horse Racing Game
 *
 * This store manages all game state including horses, races, and game flow.
 * It provides reactive state and actions for the entire application.
 *
 * @fileoverview Main Pinia store for horse racing game state management
 * @author Horse Racing Game Team
 * @version 1.0.0
 */

import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import type { Horse, Race, RaceResult, RaceState, GameState } from '../types/horse'
import {
  generateHorses,
  selectDifferentHorsesForRaces,
  simulateRace,
} from '../utils/horseGenerator'
import { GameError, RaceError, Validator, Logger } from '../utils/errors'
import { GAME_CONFIG } from '../config/gameConfig'

/**
 * Main game store using Pinia composition API
 *
 * Provides reactive state management for:
 * - Horse generation and management
 * - Race scheduling and execution
 * - Game state transitions
 * - Race results and statistics
 *
 * @returns Pinia store with reactive state and actions
 */
export const useGameStore = defineStore('game', () => {
  // ==================== STATE ====================

  /** Array of all generated horses */
  const horses = ref<Horse[]>([])

  /** Array of all scheduled races */
  const races = ref<Race[]>([])

  /** Current game state: idle, generating, racing, or completed */
  const gameState = ref<GameState>('idle')

  /** Index of the currently active race */
  const currentRaceIndex = ref(0)

  /** Legacy: Array of race results (kept for backward compatibility) */
  const raceResults = ref<RaceResult[]>([])

  /** Flag indicating if any race is currently in progress */
  const isRaceInProgress = ref(false)

  /** Flag indicating if we're in delay period between races */
  const isInRaceDelay = ref(false)

  /** Countdown timer for race delay */
  const raceDelayCountdown = ref(0)

  // ==================== COMPUTED PROPERTIES ====================

  /**
   * Determines if the game is ready to start
   * @returns true if there are enough horses and races scheduled
   */
  const isGameReady = computed(() => horses.value.length > 10 && races.value.length > 0)

  /**
   * Gets the currently active race
   * @returns The race at the current index, or undefined if none
   */
  const currentRace = computed(() => races.value[currentRaceIndex.value])

  /**
   * Checks if all races have been completed
   * @returns true if current race index exceeds total races
   */
  const allRacesCompleted = computed(() => currentRaceIndex.value >= races.value.length)

  /**
   * Gets all races that have been completed
   * @returns Array of races with results
   */
  const completedRaces = computed(() =>
    races.value.filter((race) => race.results && race.results.length > 0),
  )

  // ==================== ACTIONS ====================

  /**
   * Generates a specified number of horses for the game
   *
   * @param horseNumber - Number of horses to generate (default: 20)
   * @throws {ValidationError} If horse count is invalid
   * @throws {GameError} If generation fails
   */
  function generateGameHorses(horseNumber: number = GAME_CONFIG.defaultHorsesGenerated) {
    try {
      Validator.validateHorseCount(horseNumber)

      Logger.info('Generating horses', { count: horseNumber })
      gameState.value = 'generating'

      // Generate exactly the requested number of horses
      horses.value = generateHorses(horseNumber)

      Logger.info('Horses generated successfully', { count: horses.value.length })
      gameState.value = 'idle'
    } catch (error) {
      Logger.error('Failed to generate horses', error as Error, { horseNumber })
      gameState.value = 'idle'
      throw error
    }
  }

  /**
   * Generates a race schedule with predefined distances and horse assignments
   *
   * Creates races with different distances and assigns horses to minimize overlap.
   * Each race will have exactly the maximum number of horses per race.
   *
   * @throws {GameError} If no horses are available or insufficient horses
   * @throws {RaceError} If race creation fails
   */
  function generateRaceSchedule() {
    try {
      if (horses.value.length === 0) {
        throw new GameError('No horses available. Generate horses first.', 'NO_HORSES')
      }
      if (horses.value.length < GAME_CONFIG.minHorsesForRace) {
        throw new GameError(
          `Not enough horses available. Generate at least ${GAME_CONFIG.minHorsesForRace} horses.`,
          'INSUFFICIENT_HORSES',
          { available: horses.value.length, required: GAME_CONFIG.minHorsesForRace },
        )
      }

      Logger.info('Generating race schedule', { horseCount: horses.value.length })

      const raceDistances = [...GAME_CONFIG.raceDistances]
      const racesCount = raceDistances.length

      // Select different horses for each race
      const raceHorsesArrays = selectDifferentHorsesForRaces(
        horses.value,
        racesCount,
        GAME_CONFIG.maxHorsesPerRace,
      )

      Logger.info('Race horse selection completed', { racesCount })

      const newRaces: Race[] = []

      raceDistances.forEach((distance, index) => {
        const raceHorses = raceHorsesArrays[index]
        if (!raceHorses) {
          throw new RaceError(`Failed to get horses for race ${index + 1}`, index + 1)
        }

        newRaces.push({
          id: index + 1,
          round: index + 1,
          distance,
          horses: raceHorses,
          state: 'pending' as RaceState,
        })
      })

      races.value = newRaces
      currentRaceIndex.value = 0
      raceResults.value = []
      gameState.value = 'idle'

      Logger.info('Race schedule generated successfully', { racesCount: newRaces.length })
    } catch (error) {
      Logger.error('Failed to generate race schedule', error as Error)
      throw error
    }
  }

  /**
   * Handles the delay between races with countdown
   */
  async function delayBetweenRaces() {
    isInRaceDelay.value = true
    raceDelayCountdown.value = GAME_CONFIG.raceDelay / 1000 // Convert to seconds

    // Countdown every second
    const countdownInterval = setInterval(() => {
      raceDelayCountdown.value--
    }, 1000)

    // Wait for the full delay
    await new Promise((resolve) => setTimeout(resolve, GAME_CONFIG.raceDelay))

    // Clean up after delay is complete
    clearInterval(countdownInterval)
    isInRaceDelay.value = false
    raceDelayCountdown.value = 0
  }

  /**
   * Starts all races sequentially with delays between races
   *
   * Executes all scheduled races one by one, updating the current race index
   * and managing the overall game state throughout the process.
   *
   * @throws {GameError} If no races are scheduled
   */
  async function startRaces() {
    try {
      if (races.value.length === 0) {
        throw new GameError('No races scheduled. Generate race schedule first.', 'NO_RACES')
      }

      Logger.info('Starting all races', { raceCount: races.value.length })
      gameState.value = 'racing'
      currentRaceIndex.value = 0
      isRaceInProgress.value = true

      // Run races one by one
      for (let i = 0; i < races.value.length; i++) {
        currentRaceIndex.value = i
        const race = races.value[i]
        if (race) {
          await runSingleRace(race)
        }

        // Delay between races with countdown (except for the last race)
        if (i < races.value.length - 1) {
          await delayBetweenRaces()
        }
      }

      gameState.value = 'completed'
      isRaceInProgress.value = false
      Logger.info('All races completed successfully')
    } catch (error) {
      Logger.error('Failed to start races', error as Error)
      gameState.value = 'idle'
      isRaceInProgress.value = false
      throw error
    }
  }

  /**
   * Core race execution logic - simulates race and updates race state
   */
  async function executeRaceSimulation(race: Race): Promise<void> {
    try {
      Logger.info('Executing race simulation', { raceId: race.id, distance: race.distance })

      // Simulate the race first to get results
      const results = simulateRace(race.horses, race.distance)

      // Calculate actual race duration based on the worst (slowest) horse's time
      const worstTime = Math.max(...results.map((r) => r.time))
      const actualDuration = Math.max(worstTime * 1000, GAME_CONFIG.minRaceDuration)

      // Update race with results and actual duration
      race.results = results
      race.actualDuration = actualDuration

      // Wait for race animation to complete
      await new Promise((resolve) => setTimeout(resolve, actualDuration))

      // Set race state to completed
      race.state = 'completed'

      Logger.info('Race simulation completed', {
        raceId: race.id,
        duration: actualDuration,
        winner: results[0]?.horse.name,
      })
    } catch (error) {
      Logger.error('Failed to execute race simulation', error as Error, { raceId: race.id })
      throw error
    }
  }

  async function runSingleRace(race: Race) {
    // Set race state to racing
    race.state = 'racing'

    // Execute the core race simulation
    await executeRaceSimulation(race)
  }

  function resetGame() {
    horses.value = []
    races.value = []
    gameState.value = 'idle'
    currentRaceIndex.value = 0
    raceResults.value = []
    isRaceInProgress.value = false
  }

  function getHorseById(id: number): Horse | undefined {
    try {
      Validator.validateHorseId(id)
      const horse = horses.value.find((horse) => horse.id === id)
      Logger.debug('Horse lookup', { horseId: id, found: !!horse })
      return horse
    } catch (error) {
      Logger.error('Failed to get horse by ID', error as Error, { horseId: id })
      throw error
    }
  }

  async function runSingleRound(raceId: number) {
    try {
      Validator.validateRaceId(raceId)

      const race = races.value.find((r) => r.id === raceId)
      if (!race) {
        throw new RaceError(`Race with ID ${raceId} not found`, raceId)
      }

      if (race.state === 'completed') {
        throw new RaceError('Race is already completed', raceId)
      }

      if (race.state === 'racing') {
        throw new RaceError('Race is already in progress', raceId)
      }

      Logger.info('Running single round', { raceId })

      // Set game state to racing
      gameState.value = 'racing'
      isRaceInProgress.value = true

      // Set current race index to this race
      currentRaceIndex.value = raceId - 1

      // Set race state to racing immediately
      race.state = 'racing'

      try {
        // Execute the core race simulation
        await executeRaceSimulation(race)
      } finally {
        // Reset game state if this was the only race running
        if (races.value.every((r) => r.state !== 'racing')) {
          gameState.value = 'idle'
          isRaceInProgress.value = false
        }
      }
    } catch (error) {
      Logger.error('Failed to run single round', error as Error, { raceId })
      throw error
    }
  }

  function resetSingleRound(raceId: number) {
    try {
      Validator.validateRaceId(raceId)

      const race = races.value.find((r) => r.id === raceId)
      if (!race) {
        throw new RaceError(`Race with ID ${raceId} not found`, raceId)
      }

      Logger.info('Resetting single round', { raceId })

      // Reset race state and results
      race.state = 'pending'
      race.results = undefined
      race.actualDuration = undefined
    } catch (error) {
      Logger.error('Failed to reset single round', error as Error, { raceId })
      throw error
    }
  }

  function resetAllRounds() {
    try {
      Logger.info('Resetting all rounds', { raceCount: races.value.length })

      races.value.forEach((race) => {
        race.state = 'pending'
        race.results = undefined
        race.actualDuration = undefined
      })
      currentRaceIndex.value = 0
      gameState.value = 'idle'
      isRaceInProgress.value = false

      Logger.info('All rounds reset successfully')
    } catch (error) {
      Logger.error('Failed to reset all rounds', error as Error)
      throw error
    }
  }

  return {
    // State
    horses,
    races,
    gameState,
    currentRaceIndex,
    raceResults,
    isRaceInProgress,
    isInRaceDelay,
    raceDelayCountdown,

    // Computed
    isGameReady,
    currentRace,
    allRacesCompleted,
    completedRaces,

    // Actions
    generateGameHorses,
    generateRaceSchedule,
    startRaces,
    resetGame,
    getHorseById,
    runSingleRound,
    resetSingleRound,
    resetAllRounds,
  }
})
