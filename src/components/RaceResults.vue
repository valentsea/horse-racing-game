<template>
  <div class="race-results bg-white rounded-lg shadow-md p-6 border-2 border-gray-200">
    <h3 class="text-xl font-bold text-gray-800 mb-4 flex items-center">
      <span class="mr-2">🏆</span>
      Race Results
    </h3>

    <div v-if="completedRaces.length === 0" class="text-center text-gray-500 py-8">
      <div class="text-4xl mb-2">🏁</div>
      <p>No races completed yet</p>
    </div>

    <div v-else class="space-y-4">
      <!-- Individual Race Results -->
      <div
        v-for="race in completedRaces"
        :key="race.id"
        class="race-result border border-gray-200 rounded-lg p-4"
      >
        <div class="flex items-center justify-between mb-3">
          <h4 class="font-semibold text-gray-700">Round {{ race.round }} - {{ race.distance }}m</h4>
          <span class="text-sm text-gray-500"> {{ race.results?.length }} horses </span>
        </div>

        <!-- Top 3 Results -->
        <div class="space-y-2">
          <div
            v-for="result in race.results?.slice(0, 3)"
            :key="result.horseId"
            class="flex items-center justify-between bg-gray-50 rounded-lg p-3"
          >
            <div class="flex items-center space-x-3">
              <Badge :position="result.position" size="lg" />
              <div
                class="w-6 h-6 rounded-full border-2 border-gray-300 flex items-center justify-center"
                :style="{ backgroundColor: getHorseColor(result.horseId) }"
              >
                <span class="text-white text-xs font-bold drop-shadow-lg">🐎</span>
              </div>
              <div>
                <div class="font-medium text-gray-800">{{ getHorseName(result.horseId) }}</div>
                <div class="text-xs text-gray-500">
                  Condition: {{ getHorseCondition(result.horseId) }}
                </div>
              </div>
            </div>
            <div class="text-right">
              <div class="font-semibold text-gray-700">{{ result.time }}s</div>
              <div class="text-xs text-gray-500">Time</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Overall Statistics -->
      <div class="mt-6 pt-4 border-t border-gray-200">
        <h4 class="font-semibold text-gray-700 mb-3">Overall Statistics</h4>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="stat-card bg-blue-50 rounded-lg p-3 text-center">
            <div class="text-2xl font-bold text-blue-600">{{ completedRaces.length }}</div>
            <div class="text-sm text-blue-600">Races Completed</div>
          </div>
          <div class="stat-card bg-green-50 rounded-lg p-3 text-center">
            <div class="text-2xl font-bold text-green-600">{{ totalHorsesParticipated }}</div>
            <div class="text-sm text-green-600">Total Participants</div>
          </div>
          <div class="stat-card bg-purple-50 rounded-lg p-3 text-center">
            <div class="text-2xl font-bold text-purple-600">{{ averageRaceTime }}s</div>
            <div class="text-sm text-purple-600">Avg Race Time</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { Race } from '../types/horse'
import { Badge } from './ui'
import { createHorseLookupService } from '../utils/horseLookup'
import { memoizedComputed } from '../utils/performance'

interface Props {
  races: Race[]
}

const props = defineProps<Props>()

// Create horse lookup service for efficient lookups
const horseLookup = computed(() => createHorseLookupService(props.races))

// Memoized computed properties for better performance
const completedRaces = memoizedComputed(
  () => props.races.filter((race) => race.results && race.results.length > 0),
  [computed(() => props.races)],
)

const totalHorsesParticipated = memoizedComputed(() => {
  const uniqueHorses = new Set<number>()
  completedRaces.value.forEach((race) => {
    race.results?.forEach((result) => {
      uniqueHorses.add(result.horseId)
    })
  })
  return uniqueHorses.size
}, [completedRaces])

const averageRaceTime = memoizedComputed(() => {
  if (completedRaces.value.length === 0) return 0

  const allTimes = completedRaces.value.flatMap(
    (race) => race.results?.map((result) => result.time) || [],
  )

  if (allTimes.length === 0) return 0

  const average = allTimes.reduce((sum, time) => sum + time, 0) / allTimes.length
  return Math.round(average * 100) / 100
}, [completedRaces])

// Memoized lookup functions
function getHorseColor(horseId: number): string {
  return horseLookup.value.getHorseColor(horseId)
}

function getHorseName(horseId: number): string {
  return horseLookup.value.getHorseName(horseId)
}

function getHorseCondition(horseId: number): number {
  return horseLookup.value.getHorseCondition(horseId)
}
</script>
