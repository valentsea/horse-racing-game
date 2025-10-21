<template>
  <BaseCard variant="bordered">
    <template #header><h3 class="text-base font-bold text-gray-600">Horses</h3></template>

    <div
      v-if="gameStore.horses.length === 0"
      class="text-center flex flex-col items-center justify-start sm:justify-center min-h-[300px] sm:min-h-[400px] space-y-4 sm:space-y-6 py-6 sm:py-8 h-[calc(100vh-8rem)]"
    >
      <!-- Welcome Section -->
      <div class="space-y-3 sm:space-y-4">
        <!-- Large Horse Icon -->
        <div class="text-4xl sm:text-6xl mb-3 sm:mb-4">🐎</div>

        <!-- Welcome Text -->
        <h2 class="text-xl sm:text-2xl font-bold text-gray-800 mb-2">Ready to Race?</h2>
        <p class="text-sm sm:text-base text-gray-600 max-w-md mx-auto px-4">
          Generate horses and start racing!
        </p>
      </div>

      <!-- Generate Button -->
      <Button
        variant="primary"
        size="lg"
        :loading="gameStore.gameState === 'generating'"
        @click="handleGenerateHorses"
        class="w-full sm:w-auto"
      >
        <span class="ml-2">
          {{ gameStore.gameState === 'generating' ? 'Generating...' : 'Generate horses' }}
        </span>
      </Button>
    </div>

    <!-- Horses List -->
    <div v-else class="max-h-[calc(100vh-8rem)] overflow-y-auto">
      <!-- Selected Horses Section -->
      <div v-if="selectedHorses.length > 0">
        <div
          class="px-2 py-1 bg-blue-100 text-xs font-medium text-blue-700 border-b border-blue-200 flex justify-between"
        >
          <div class="flex-1">
            Selected for Round {{ activeRace?.round || '' }} ({{ selectedHorses.length }})
          </div>
          <div class="text-right">
            <div class="text-xs text-gray-600">Condition</div>
          </div>
        </div>
        <HorseCard
          v-for="horse in selectedHorses"
          :key="horse.id"
          :horse="horse"
          :is-selected="true"
        />
      </div>

      <!-- Unselected Horses Section -->
      <div v-if="unselectedHorses.length > 0">
        <div
          class="px-2 py-1 bg-gray-100 text-xs font-medium text-gray-600 border-b border-gray-200 flex justify-between"
        >
          <div class="flex-1">Horses ({{ unselectedHorses.length }})</div>

          <div class="text-right">Condition</div>
        </div>
        <HorseCard
          v-for="horse in unselectedHorses"
          :key="horse.id"
          :horse="horse"
          :is-selected="false"
        />
      </div>
    </div>
  </BaseCard>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useGameStore } from '../stores/gameStore'
import { BaseCard, Button } from './ui'
import HorseCard from './HorseCard.vue'

interface Props {
  activeTab: number | string
}

const props = defineProps<Props>()
const gameStore = useGameStore()
const numberOfHorsesToGenerate = ref(20)

// Computed properties to separate selected and unselected horses
const selectedHorses = computed(() => {
  if (!gameStore.horses.length) return []
  return gameStore.horses.filter((horse) => isHorseInActiveRace(horse.id))
})

const unselectedHorses = computed(() => {
  if (!gameStore.horses.length) return []
  return gameStore.horses.filter((horse) => !isHorseInActiveRace(horse.id))
})

const activeRace = computed(() => {
  const race = gameStore.races.find((race) => race.id === Number(props.activeTab))
  return race
})

function isHorseInActiveRace(horseId: number): boolean {
  if (!activeRace.value) return false
  return activeRace.value.horses.some((horse) => horse.id === horseId)
}

function handleGenerateHorses() {
  try {
    gameStore.generateGameHorses(numberOfHorsesToGenerate.value)
  } catch (error) {
    console.error('Error generating horses:', error)
  }
}
</script>
