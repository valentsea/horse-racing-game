<template>
  <div class="horse-racing-game min-h-screen bg-gray-50">
    <!-- Header -->
    <div
      class="px-2 sm:px-4 py-1 sm:py-2 flex justify-between items-center bg-gray-50 sticky top-0 sm:static z-10"
    >
      <h1 class="text-base sm:text-lg font-bold text-gray-400">Horse Racing Game</h1>
      <GameControls />
    </div>

    <!-- Game Layout -->
    <div class="flex flex-col lg:grid lg:grid-cols-12 gap-2 pb-6 px-2 sm:px-4">
      <!-- Left Column - Controls and Horses -->
      <div class="space-y-4 lg:col-span-2 order-2 lg:order-1">
        <!-- Horses List -->
        <HorsesList :active-tab="activeTab" />
      </div>

      <!-- Right Column - Results -->
      <div class="space-y-6 lg:col-span-10 order-1 lg:order-2">
        <!-- Rounds Tabs -->
        <div v-if="gameStore.races.length > 0">
          <Tabs
            ref="tabsRef"
            :tabs="roundTabs"
            :defaultTab="activeTab"
            :showStartButton="true"
            :showResetMenu="true"
            :canStartGame="canStartRaces"
            :canGenerateSchedule="canGenerateSchedule"
            :isRacing="gameStore.gameState === 'racing'"
            @start-game="handleStartRaces"
            @new-schedule="handleGenerateSchedule"
            @reset-all-rounds="handleResetAllRounds"
          >
            <template #default="{ activeTab: currentTab }">
              <RoundTabContent
                v-for="race in gameStore.races"
                :key="race.id"
                v-show="currentTab === race.id"
                :race="race"
              />
              <GameStatistics v-show="currentTab === -1" />
            </template>
          </Tabs>
        </div>

        <!-- No Races Message -->
        <BaseCard
          v-else
          class="flex flex-col justify-center items-center min-h-[300px] sm:min-h-[400px] space-y-4 sm:space-y-6 py-6 sm:py-8 h-[calc(50vh-2rem)] sm:h-[calc(60vh-3rem)]"
        >
          <!-- Schedule Section -->
          <div
            class="text-center space-y-3 sm:space-y-4 mb-3 sm:mb-4"
            :class="{ 'opacity-50': !canGenerateSchedule }"
          >
            <!-- Large Calendar Icon -->
            <div
              class="text-4xl sm:text-6xl mb-3 sm:mb-4"
              :class="{ grayscale: !canGenerateSchedule }"
            >
              📅
            </div>

            <!-- Schedule Text -->
            <h2
              class="text-xl sm:text-2xl font-bold mb-2"
              :class="canGenerateSchedule ? 'text-gray-800' : 'text-gray-400'"
            >
              Create Race Schedule
            </h2>
            <p
              class="max-w-md mx-auto text-sm sm:text-base px-4"
              :class="canGenerateSchedule ? 'text-gray-600' : 'text-gray-400'"
            >
              {{
                canGenerateSchedule
                  ? 'Generate rounds and start racing!'
                  : 'Generate horses first to create a schedule'
              }}
            </p>
          </div>

          <!-- Generate Schedule Button -->
          <div class="w-full flex justify-center px-4">
            <Button
              :disabled="!canGenerateSchedule"
              variant="primary"
              size="lg"
              @click="gameStore.generateRaceSchedule()"
              class="w-full sm:w-auto"
            >
              Generate Schedule
            </Button>
          </div>
        </BaseCard>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useGameStore } from '../stores/gameStore'
import type { Tab } from './ui/Tabs.vue' // Updated Tab interface with disabled property
import GameControls from './GameControls.vue'
import HorsesList from './HorsesList.vue'
import RoundTabContent from './RoundTabContent.vue'
import GameStatistics from './GameStatistics.vue'
import { Tabs } from './ui'
import Button from './ui/Button.vue'
import BaseCard from './ui/Card.vue'

const gameStore = useGameStore()
const activeTab = ref<number | string>(1)
const tabsRef = ref()

const roundTabs = computed((): Tab[] => {
  const raceTabs: Tab[] = gameStore.races.map((race) => ({
    id: race.id,
    label: `Round ${race.round}`,
    badge: getRaceStateBadge(race.state),
  }))

  // Always add statistics tab, but disable it if not all races are completed
  const allRacesCompleted =
    gameStore.races.length > 0 && gameStore.races.every((race) => race.state === 'completed')
  raceTabs.push({
    id: -1, // Use negative number for statistics tab
    label: 'Statistics',
    badge: allRacesCompleted ? '✓' : '⏳',
    disabled: !allRacesCompleted,
  })

  return raceTabs
})

function getRaceStateBadge(state: string): string | undefined {
  switch (state) {
    case 'pending':
      return '⏳'
    case 'racing':
      return '🏃'
    case 'completed':
      return '✓'
    default:
      return undefined
  }
}

// Watch for current race changes to automatically switch tabs
watch(
  () => gameStore.currentRaceIndex,
  (newIndex) => {
    if (newIndex >= 0 && gameStore.races[newIndex]) {
      activeTab.value = gameStore.races[newIndex].id
    }
  },
  { immediate: true },
)

// Watch for all races completion to switch to statistics tab
watch(
  () => gameStore.races.every((race) => race.state === 'completed'),
  (allCompleted) => {
    if (allCompleted && gameStore.races.length > 0) {
      // Switch to statistics tab when all races are completed with 5-second delay
      setTimeout(() => {
        activeTab.value = -1
      }, 5000)
    }
  },
)

// Watch for race state changes to switch to current race when racing starts
watch(
  () => gameStore.gameState,
  (newState) => {
    if (newState === 'racing' && gameStore.currentRace) {
      activeTab.value = gameStore.currentRace.id
    }
  },
)

// Watch for manual tab changes to update activeTab
watch(
  () => tabsRef.value?.activeTab,
  (newTab) => {
    if (newTab !== undefined && newTab !== activeTab.value) {
      activeTab.value = newTab
    }
  },
  { deep: true },
)

// Watch for races array changes to reset activeTab when game is reset
watch(
  () => gameStore.races,
  (newRaces) => {
    if (newRaces.length === 0) {
      // Reset to first tab when no races exist (new game)
      activeTab.value = 1
    }
  },
  { immediate: true },
)

const canGenerateSchedule = computed(
  () =>
    gameStore.horses.length > 0 &&
    gameStore.gameState === 'idle' &&
    !gameStore.races.some((race) => race.state === 'completed'),
)

const canStartRaces = computed(() => gameStore.races.length > 0 && gameStore.gameState === 'idle')

function handleGenerateSchedule() {
  try {
    gameStore.generateRaceSchedule()
  } catch (error) {
    console.error('Error generating schedule:', error)
  }
}

function handleStartRaces() {
  try {
    gameStore.startRaces()
  } catch (error) {
    console.error('Error starting races:', error)
  }
}

function handleResetAllRounds() {
  const confirmed = confirm(
    'Are you sure you want to reset all rounds? This will clear all race results and reset all rounds to pending state.',
  )
  if (!confirmed) return

  try {
    gameStore.resetAllRounds()
  } catch (error) {
    console.error('Error resetting all rounds:', error)
  }
}
</script>
