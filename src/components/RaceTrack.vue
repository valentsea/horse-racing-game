<template>
  <div class="race-track bg-gray-100 rounded-lg p-6 border-2 border-gray-300">
    <div class="mb-4">
      <h3 class="text-xl font-bold text-gray-800 mb-2">
        {{ race ? `Round ${race.round} - ${race.distance}m` : 'No Race Active' }}
      </h3>
      <div v-if="race" class="text-sm text-gray-600">{{ race.horses.length }} horses competing</div>
    </div>

    <!-- Race Track -->
    <div class="race-track-area relative bg-green-200 rounded-lg p-4 min-h-96">
      <!-- Track Lines -->
      <div class="absolute inset-0 flex flex-col justify-between py-2">
        <div v-for="i in 10" :key="i" class="h-px bg-gray-400 opacity-30"></div>
      </div>

      <!-- Racing Horses -->
      <div v-if="race && isRaceActive" class="relative">
        <RacingHorse
          v-for="horse in race.horses"
          :key="horse.id"
          :horse="horse"
          :progress="getHorseProgress(horse.id)"
          :race-duration="raceDuration"
          :position="getHorsePosition(horse.id)"
        />
      </div>

      <!-- Race Results -->
      <div v-if="race && race.results && !isRaceActive" class="space-y-2">
        <div
          v-for="result in race.results.slice(0, 3)"
          :key="result.horseId"
          class="flex items-center justify-between bg-white rounded-lg p-3 shadow-sm"
        >
          <div class="flex items-center space-x-3">
            <Badge :position="result.position" size="lg" />
            <div
              class="w-6 h-6 rounded-full border-2 border-gray-300 flex items-center justify-center"
              :style="{ backgroundColor: getHorseColor(result.horseId) }"
            >
              <span class="text-white text-xs font-bold drop-shadow-lg">🐎</span>
            </div>
            <span class="font-medium">{{ getHorseName(result.horseId) }}</span>
          </div>
          <span class="text-sm text-gray-600">{{ result.time }}s</span>
        </div>
      </div>

      <!-- Start Line -->
      <div class="absolute left-0 top-0 w-1 h-full bg-red-500"></div>

      <!-- Finish Line -->
      <div class="absolute right-0 top-0 w-1 h-full bg-red-500"></div>
    </div>

    <!-- Race Status -->
    <div class="mt-4 text-center">
      <div v-if="isRaceActive" class="text-blue-600 font-medium">🏃‍♂️ Race in Progress...</div>
      <div v-else-if="race && race.results" class="text-green-600 font-medium">
        ✅ Race Completed!
      </div>
      <div v-else class="text-gray-500">Waiting for race to start...</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import type { Race } from '../types/horse'
import RacingHorse from './RacingHorse.vue'
import { Badge } from './ui'

interface Props {
  race: Race | null
  isRaceActive: boolean
}

const props = defineProps<Props>()

// Create efficient horse lookup map
const horseMap = computed(() => {
  if (!props.race) return new Map()
  return new Map(props.race.horses.map((horse) => [horse.id, horse]))
})

const raceDuration = ref(3000) // 3 seconds default
const horseProgress = ref<Record<number, number>>({})

// Watch for race changes to reset progress
watch(
  () => props.race,
  (newRace) => {
    if (newRace) {
      horseProgress.value = {}
      newRace.horses.forEach((horse) => {
        horseProgress.value[horse.id] = 0
      })
    }
  },
)

// Watch for race active state to animate horses
watch(
  () => props.isRaceActive,
  (isActive) => {
    if (isActive && props.race) {
      animateRace()
    }
  },
)

function animateRace() {
  if (!props.race) return

  // Simulate horse movement with different speeds based on condition
  props.race.horses.forEach((horse) => {
    const speed = horse.condition / 100 // Convert condition to speed factor
    const duration = raceDuration.value * (1.2 - speed) // Higher condition = faster

    setTimeout(() => {
      horseProgress.value[horse.id] = 100
    }, duration)
  })
}

function getHorseProgress(horseId: number): number {
  return horseProgress.value[horseId] || 0
}

function getHorsePosition(horseId: number): number | undefined {
  if (!props.race?.results) return undefined

  const result = props.race.results.find((r) => r.horseId === horseId)
  return result?.position
}

function getHorseColor(horseId: number): string {
  const horse = horseMap.value.get(horseId)
  return horse?.color.value || '#000000'
}

function getHorseName(horseId: number): string {
  const horse = horseMap.value.get(horseId)
  return horse?.name || 'Unknown'
}
</script>
