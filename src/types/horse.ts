export interface Horse {
  id: number
  name: string
  color: { name: string; value: string }
  condition: number
}

export type RaceState = 'pending' | 'racing' | 'completed'

export interface Race {
  id: number
  round: number
  distance: number
  horses: Horse[]
  results?: RaceResult[]
  actualDuration?: number // Actual race duration in milliseconds
  state: RaceState // Current state of the race
}

export interface RaceResult {
  horseId: number
  position: number
  time: number
  horse: {
    id: number
    name: string
    color: { name: string; value: string }
    condition: number
  }
  speed: number // Speed in m/s
  distance: number // Race distance
  gap: number // Gap behind winner in seconds
}

// Enhanced types for better type safety
export interface HorseStats {
  races: number
  wins: number
  averageTime: number
  bestTime: number
  totalDistance: number
}

export interface GameConfig {
  minHorsesForRace: number
  maxHorsesPerRace: number
  defaultHorsesGenerated: number
  raceDistances: readonly number[]
  minRaceDuration: number
  raceDelay: number
}

export type GameState = 'idle' | 'generating' | 'racing' | 'completed'

export interface RaceSimulationResult {
  horseId: number
  position: number
  time: number
  horse: Pick<Horse, 'id' | 'name' | 'color' | 'condition'>
  speed: number
  distance: number
  gap: number
}
