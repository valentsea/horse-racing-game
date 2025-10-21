import type { Horse, Race } from '../types/horse'

/**
 * Horse lookup service for efficient horse data retrieval
 */
export class HorseLookupService {
  private horseMap: Map<number, Horse> = new Map()

  constructor(races: Race[]) {
    this.buildHorseMap(races)
  }

  /**
   * Build a map of horses for O(1) lookup
   */
  private buildHorseMap(races: Race[]): void {
    this.horseMap.clear()

    for (const race of races) {
      for (const horse of race.horses) {
        // Only add if not already present (horses can appear in multiple races)
        if (!this.horseMap.has(horse.id)) {
          this.horseMap.set(horse.id, horse)
        }
      }
    }
  }

  /**
   * Get horse by ID with O(1) lookup
   */
  getHorse(horseId: number): Horse | undefined {
    return this.horseMap.get(horseId)
  }

  /**
   * Get horse color by ID
   */
  getHorseColor(horseId: number): string {
    const horse = this.horseMap.get(horseId)
    return horse?.color.value || '#000000'
  }

  /**
   * Get horse name by ID
   */
  getHorseName(horseId: number): string {
    const horse = this.horseMap.get(horseId)
    return horse?.name || 'Unknown'
  }

  /**
   * Get horse condition by ID
   */
  getHorseCondition(horseId: number): number {
    const horse = this.horseMap.get(horseId)
    return horse?.condition || 0
  }

  /**
   * Update the lookup service with new races data
   */
  updateRaces(races: Race[]): void {
    this.buildHorseMap(races)
  }

  /**
   * Get all horses in the lookup service
   */
  getAllHorses(): Horse[] {
    return Array.from(this.horseMap.values())
  }

  /**
   * Check if a horse exists in the lookup service
   */
  hasHorse(horseId: number): boolean {
    return this.horseMap.has(horseId)
  }
}

/**
 * Create a horse lookup service instance
 */
export function createHorseLookupService(races: Race[]): HorseLookupService {
  return new HorseLookupService(races)
}
