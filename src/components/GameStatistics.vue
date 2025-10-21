<template>
  <div class="game-statistics p-3 sm:p-6 max-h-[calc(100vh-10rem)] overflow-y-auto">
    <!-- Statistics Header -->
    <div class="mb-4 sm:mb-6">
      <h2 class="text-xl sm:text-2xl font-bold text-gray-800 mb-2 flex items-center">
        <span class="mr-2">📊</span>
        Game Statistics
      </h2>
      <p class="text-sm sm:text-base text-gray-600">
        Comprehensive overview of all races and horse performance
      </p>
    </div>

    <!-- Summary Cards -->
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4 mb-6 sm:mb-8">
      <BaseCard class="p-2 sm:p-4">
        <div class="flex items-center">
          <div class="p-1 sm:p-2 bg-blue-100 rounded-lg">
            <span class="text-lg sm:text-2xl">🏁</span>
          </div>
          <div class="ml-2 sm:ml-3">
            <p class="text-xs sm:text-sm font-medium text-gray-600">Total Races</p>
            <p class="text-lg sm:text-2xl font-bold text-gray-900">{{ completedRaces.length }}</p>
          </div>
        </div>
      </BaseCard>

      <BaseCard class="p-2 sm:p-4">
        <div class="flex items-center">
          <div class="p-1 sm:p-2 bg-green-100 rounded-lg">
            <span class="text-lg sm:text-2xl">🐎</span>
          </div>
          <div class="ml-2 sm:ml-3">
            <p class="text-xs sm:text-sm font-medium text-gray-600">Total Horses</p>
            <p class="text-lg sm:text-2xl font-bold text-gray-900">{{ totalHorses }}</p>
          </div>
        </div>
      </BaseCard>

      <BaseCard class="p-2 sm:p-4">
        <div class="flex items-center">
          <div class="p-1 sm:p-2 bg-yellow-100 rounded-lg">
            <span class="text-lg sm:text-2xl">⚡</span>
          </div>
          <div class="ml-2 sm:ml-3">
            <p class="text-xs sm:text-sm font-medium text-gray-600">Fastest Time</p>
            <p class="text-lg sm:text-2xl font-bold text-gray-900">{{ fastestTime }}s</p>
          </div>
        </div>
      </BaseCard>

      <BaseCard class="p-2 sm:p-4">
        <div class="flex items-center">
          <div class="p-1 sm:p-2 bg-purple-100 rounded-lg">
            <span class="text-lg sm:text-2xl">📏</span>
          </div>
          <div class="ml-2 sm:ml-3">
            <p class="text-xs sm:text-sm font-medium text-gray-600">Total Distance</p>
            <p class="text-lg sm:text-2xl font-bold text-gray-900">{{ totalDistance }}m</p>
          </div>
        </div>
      </BaseCard>
    </div>

    <!-- Horse Performance Rankings -->
    <div class="mb-6 sm:mb-8">
      <h3 class="text-lg sm:text-xl font-semibold text-gray-800 mb-3 sm:mb-4 flex items-center">
        <span class="mr-2">🏆</span>
        Horse Performance Rankings
      </h3>

      <!-- Mobile Card View -->
      <div class="block sm:hidden space-y-3">
        <div
          v-for="(horse, index) in horseRankings"
          :key="horse.id"
          class="bg-white border border-gray-200 rounded-lg p-3 shadow-sm"
          :class="{
            'bg-yellow-50 border-yellow-200': index === 0,
            'bg-gray-50 border-gray-300': index === 1,
            'bg-orange-50 border-orange-200': index === 2,
          }"
        >
          <div class="flex items-center justify-between mb-2">
            <div class="flex items-center space-x-2">
              <span class="text-lg font-bold text-gray-700">{{ index + 1 }}</span>
              <Badge :position="index + 1" size="sm" />
            </div>
            <div class="text-right">
              <div class="text-sm font-semibold">{{ horse.stats.wins }} wins</div>
              <div class="text-xs text-gray-500">{{ horse.stats.races }} races</div>
            </div>
          </div>
          <div class="flex items-center space-x-2 mb-2">
            <div
              class="w-6 h-6 rounded-full border border-gray-300 flex items-center justify-center"
              :style="{ backgroundColor: horse.color.value }"
            >
              <span class="text-white text-xs font-bold">🐎</span>
            </div>
            <span class="font-medium text-sm">{{ horse.name }}</span>
            <span class="text-xs text-gray-500">({{ horse.color.name }})</span>
          </div>
          <div class="grid grid-cols-2 gap-2 text-xs text-gray-600">
            <div>Avg Position: {{ horse.stats.averagePosition.toFixed(1) }}</div>
            <div>Best Time: {{ horse.stats.bestTime.toFixed(2) }}s</div>
            <div>Avg Speed: {{ horse.stats.averageSpeed.toFixed(2) }} m/s</div>
          </div>
        </div>
      </div>

      <!-- Desktop Table View -->
      <BaseCard class="hidden sm:block overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-gray-50">
              <tr>
                <th
                  class="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider"
                >
                  Rank
                </th>
                <th
                  class="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider"
                >
                  Horse
                </th>
                <th
                  class="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider"
                >
                  Color
                </th>
                <th
                  class="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider"
                >
                  Races
                </th>
                <th
                  class="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider"
                >
                  Wins
                </th>
                <th
                  class="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider"
                >
                  Avg Position
                </th>
                <th
                  class="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider"
                >
                  Best Time
                </th>
                <th
                  class="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider"
                >
                  Avg Speed
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr
                v-for="(horse, index) in horseRankings"
                :key="horse.id"
                class="hover:bg-gray-50 transition-colors duration-100"
                :class="{
                  'bg-yellow-50': index === 0,
                  'bg-gray-50': index === 1,
                  'bg-orange-50': index === 2,
                }"
              >
                <td class="px-4 py-3">
                  <div class="flex items-center space-x-2">
                    <span class="text-lg font-bold text-gray-700">{{ index + 1 }}</span>
                    <Badge :position="index + 1" size="sm" />
                  </div>
                </td>
                <td class="px-4 py-3">
                  <div class="flex items-center space-x-2">
                    <div
                      class="w-6 h-6 rounded-full border border-gray-300 flex items-center justify-center"
                      :style="{ backgroundColor: horse.color.value }"
                    >
                      <span class="text-white text-xs font-bold">🐎</span>
                    </div>
                    <span class="font-medium text-sm">{{ horse.name }}</span>
                  </div>
                </td>
                <td class="px-4 py-3 text-sm text-gray-600">{{ horse.color.name }}</td>
                <td class="px-4 py-3 text-sm text-gray-600">{{ horse.stats.races }}</td>
                <td class="px-4 py-3 text-sm text-gray-600">{{ horse.stats.wins }}</td>
                <td class="px-4 py-3 text-sm text-gray-600">
                  {{ horse.stats.averagePosition.toFixed(1) }}
                </td>
                <td class="px-4 py-3 text-sm text-gray-600">
                  {{ horse.stats.bestTime.toFixed(2) }}s
                </td>
                <td class="px-4 py-3 text-sm text-gray-600">
                  {{ horse.stats.averageSpeed.toFixed(2) }} m/s
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </BaseCard>
    </div>

    <!-- Race-by-Race Results -->
    <div class="mb-8">
      <h3 class="text-xl font-semibold text-gray-800 mb-4 flex items-center">
        <span class="mr-2">📋</span>
        Race-by-Race Results
      </h3>

      <div class="space-y-4">
        <BaseCard v-for="race in completedRaces" :key="race.id" class="p-4">
          <div class="flex items-center justify-between mb-3">
            <h4 class="text-lg font-semibold text-gray-800">Round {{ race.round }}</h4>
            <div class="flex items-center space-x-4 text-sm text-gray-600">
              <span>Distance: {{ race.distance }}m</span>
              <span>Winner: {{ getWinnerName(race) }}</span>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div
              v-for="(result, index) in getTopThree(race)"
              :key="result.horseId"
              class="flex items-center space-x-3 p-3 rounded-lg"
              :class="{
                'bg-yellow-100': index === 0,
                'bg-gray-100': index === 1,
                'bg-orange-100': index === 2,
              }"
            >
              <Badge :position="result.position" size="sm" />
              <div
                class="w-6 h-6 rounded-full border border-gray-300 flex items-center justify-center"
                :style="{ backgroundColor: result.horse.color.value }"
              >
                <span class="text-white text-xs font-bold">🐎</span>
              </div>
              <div>
                <div class="font-medium text-sm">{{ result.horse.name }}</div>
                <div class="text-xs text-gray-600">{{ result.time }}s</div>
              </div>
            </div>
          </div>
        </BaseCard>
      </div>
    </div>

    <!-- Performance Charts -->
    <div class="mb-8">
      <h3 class="text-xl font-semibold text-gray-800 mb-4 flex items-center">
        <span class="mr-2">📈</span>
        Performance Analysis
      </h3>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Average Speed by Distance -->
        <BaseCard class="p-4">
          <h4 class="text-lg font-semibold text-gray-800 mb-4">Average Speed by Distance</h4>
          <div class="space-y-3">
            <div
              v-for="distance in uniqueDistances"
              :key="distance"
              class="flex items-center justify-between"
            >
              <span class="text-sm text-gray-600">{{ distance }}m</span>
              <div class="flex items-center space-x-2">
                <div class="w-32 bg-gray-200 rounded-full h-2">
                  <div
                    class="bg-blue-500 h-2 rounded-full transition-all duration-250"
                    :style="{ width: `${getSpeedPercentage(distance)}%` }"
                  ></div>
                </div>
                <span class="text-sm font-medium text-gray-800 w-16 text-right">
                  {{ getAverageSpeedForDistance(distance).toFixed(2) }} m/s
                </span>
              </div>
            </div>
          </div>
        </BaseCard>

        <!-- Win Distribution -->
        <BaseCard class="p-4">
          <h4 class="text-lg font-semibold text-gray-800 mb-4">Win Distribution</h4>
          <div class="space-y-3">
            <div
              v-for="horse in topWinners"
              :key="horse.id"
              class="flex items-center justify-between"
            >
              <div class="flex items-center space-x-2">
                <div
                  class="w-4 h-4 rounded-full border border-gray-300"
                  :style="{ backgroundColor: horse.color.value }"
                ></div>
                <span class="text-sm text-gray-600">{{ horse.name }}</span>
              </div>
              <div class="flex items-center space-x-2">
                <div class="w-24 bg-gray-200 rounded-full h-2">
                  <div
                    class="bg-green-500 h-2 rounded-full transition-all duration-250"
                    :style="{ width: `${(horse.stats.wins / maxWins) * 100}%` }"
                  ></div>
                </div>
                <span class="text-sm font-medium text-gray-800 w-8 text-right">
                  {{ horse.stats.wins }}
                </span>
              </div>
            </div>
          </div>
        </BaseCard>
      </div>
    </div>

    <!-- Empty State -->
    <div v-if="completedRaces.length === 0" class="text-center py-12">
      <div class="text-6xl mb-4">📊</div>
      <h3 class="text-xl font-semibold text-gray-600 mb-2">No Statistics Available</h3>
      <p class="text-gray-500">Complete some races to see detailed statistics</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useGameStore } from '../stores/gameStore'
import { BaseCard, Badge } from './ui'
import type { Horse, Race, RaceResult } from '../types/horse'

const gameStore = useGameStore()

// Computed properties for statistics
const completedRaces = computed(() =>
  gameStore.races.filter((race) => race.results && race.results.length > 0),
)

const totalHorses = computed(() => gameStore.horses.length)

const fastestTime = computed(() => {
  const allResults = completedRaces.value.flatMap((race) => race.results || [])
  if (allResults.length === 0) return 0
  return Math.min(...allResults.map((result) => result.time))
})

const totalDistance = computed(() =>
  completedRaces.value.reduce((sum, race) => sum + race.distance, 0),
)

const uniqueDistances = computed(() => {
  const distances = completedRaces.value.map((race) => race.distance)
  return [...new Set(distances)].sort((a, b) => a - b)
})

// Horse statistics calculations
const horseStats = computed(() => {
  const stats = new Map<
    number,
    {
      horse: Horse
      races: number
      wins: number
      positions: number[]
      times: number[]
      speeds: number[]
    }
  >()

  // Initialize stats for all horses
  gameStore.horses.forEach((horse) => {
    stats.set(horse.id, {
      horse,
      races: 0,
      wins: 0,
      positions: [],
      times: [],
      speeds: [],
    })
  })

  // Collect data from all completed races
  completedRaces.value.forEach((race) => {
    race.results?.forEach((result) => {
      const horseStat = stats.get(result.horseId)
      if (horseStat) {
        horseStat.races++
        horseStat.positions.push(result.position)
        horseStat.times.push(result.time)
        horseStat.speeds.push(result.speed)
        if (result.position === 1) {
          horseStat.wins++
        }
      }
    })
  })

  return stats
})

const horseRankings = computed(() => {
  const rankings = Array.from(horseStats.value.values())
    .filter((stat) => stat.races > 0)
    .map((stat) => ({
      ...stat.horse,
      stats: {
        races: stat.races,
        wins: stat.wins,
        averagePosition: stat.positions.reduce((sum, pos) => sum + pos, 0) / stat.positions.length,
        bestTime: Math.min(...stat.times),
        averageSpeed: stat.speeds.reduce((sum, speed) => sum + speed, 0) / stat.speeds.length,
      },
    }))
    .sort((a, b) => {
      // Sort by wins first, then by average position
      if (b.stats.wins !== a.stats.wins) {
        return b.stats.wins - a.stats.wins
      }
      return a.stats.averagePosition - b.stats.averagePosition
    })

  return rankings
})

const topWinners = computed(() => horseRankings.value.slice(0, 5))

const maxWins = computed(() => Math.max(...horseRankings.value.map((horse) => horse.stats.wins), 1))

// Helper functions
function getWinnerName(race: Race): string {
  const winner = race.results?.find((result) => result.position === 1)
  return winner ? winner.horse.name : 'Unknown'
}

function getTopThree(race: Race): RaceResult[] {
  return race.results?.slice(0, 3) || []
}

function getAverageSpeedForDistance(distance: number): number {
  const racesAtDistance = completedRaces.value.filter((race) => race.distance === distance)
  if (racesAtDistance.length === 0) return 0

  const allSpeeds = racesAtDistance.flatMap(
    (race) => race.results?.map((result) => result.speed) || [],
  )

  return allSpeeds.reduce((sum, speed) => sum + speed, 0) / allSpeeds.length
}

function getSpeedPercentage(distance: number): number {
  const avgSpeed = getAverageSpeedForDistance(distance)
  const maxSpeed = Math.max(...uniqueDistances.value.map((d) => getAverageSpeedForDistance(d)))
  return maxSpeed > 0 ? (avgSpeed / maxSpeed) * 100 : 0
}
</script>

<style scoped>
/* Animation for cards */
.card-enter-active {
  transition: all 0.15s ease-out;
}

.card-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

/* Progress bar animations */
.bg-blue-500,
.bg-green-500 {
  transition: width 0.25s ease-in-out;
}
</style>
