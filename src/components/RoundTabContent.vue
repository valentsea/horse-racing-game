<template>
  <div class="round-tab-content p-3 sm:p-6 max-h-[calc(100vh-8rem)] overflow-y-auto">
    <!-- Round Header -->
    <div class="mb-4 sm:mb-6">
      <div
        class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 space-y-2 sm:space-y-0"
      >
        <div class="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
          <h2 class="text-xl sm:text-2xl font-bold text-gray-800">Round {{ race.round }}</h2>
          <div class="flex items-center space-x-2">
            <div
              :class="getStateBadgeClasses(race.state)"
              class="px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium"
            >
              {{ getStateIcon(race.state) }} {{ getStateText(race.state) }}
            </div>
          </div>
        </div>
        <div class="flex items-center justify-between sm:space-x-3">
          <div class="text-xs sm:text-sm text-gray-600">Distance: {{ race.distance }}m</div>
          <div class="flex items-center space-x-2">
            <!-- Three-dot menu for round actions -->
            <div
              class="relative round-menu-container"
              v-if="race.state === 'pending' || race.state === 'completed'"
            >
              <button
                @click="toggleRoundMenu"
                class="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
                :disabled="gameStore.isRaceInProgress"
              >
                <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z"
                  />
                </svg>
              </button>

              <!-- Dropdown menu -->
              <div
                v-if="showRoundMenu"
                class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-10"
              >
                <div class="py-1">
                  <button
                    v-if="race.state === 'pending'"
                    @click="runRound"
                    class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                    :disabled="gameStore.isRaceInProgress"
                  >
                    <span>🔄</span>
                    <span>Run Round</span>
                  </button>
                  <button
                    v-if="race.state === 'completed'"
                    @click="resetRound"
                    class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                    :disabled="gameStore.isRaceInProgress"
                  >
                    <span>🔄</span>
                    <span>Reset Round</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Round Progress Bar -->
    <div class="mb-6">
      <div class="w-full bg-gray-200 rounded-full h-2.5 mb-2">
        <div
          class="bg-gradient-to-r from-green-500 to-green-600 h-2.5 rounded-full transition-all duration-150 ease-out"
          :style="{ width: `${raceProgressPercentage}%` }"
        ></div>
      </div>
      <div class="flex items-center justify-between mb-6">
        <span class="text-sm text-gray-600">
          {{ getProgressStatusText() }}
        </span>
      </div>
    </div>

    <!-- Individual Tracks Results Display -->
    <div v-if="race.results && race.results.length > 0" class="individual-tracks-view">
      <div class="tracks-container space-y-2">
        <div
          v-for="(result, index) in originalOrderResults"
          :key="result.horseId"
          class="individual-track-container relative"
          :style="{ animationDelay: `${index * 50}ms` }"
        >
          <!-- Absolutely Positioned Track Info -->
          <div
            class="track-info absolute -top-1 sm:top-0 left-0 right-0 z-10 flex items-center justify-between py-1 px-2 bg-transparent"
          >
            <div class="flex items-center space-x-2">
              <div
                class="w-6 h-6 rounded-full border border-gray-300 flex items-center justify-center"
                :style="{ backgroundColor: result.horse.color.value }"
              >
                <span class="text-white text-xs font-bold">🐎</span>
              </div>
              <div>
                <div class="font-medium text-white text-sm">{{ result.horse.name }}</div>
              </div>
            </div>
            <div class="flex items-center space-x-3">
              <div class="text-right">
                <div v-if="race.state === 'completed'" class="text-xs text-white">
                  {{ result.time }}s
                </div>
              </div>
            </div>
          </div>

          <!-- Individual Track -->
          <div
            class="individual-track relative h-10 bg-gradient-to-r from-green-400 to-green-600 rounded-lg overflow-hidden border border-gray-300"
          >
            <!-- Start Line -->
            <div class="absolute left-0 top-0 w-0.5 h-full bg-red-500"></div>

            <!-- Finish Line -->
            <div class="absolute right-0 top-0 w-0.5 h-full bg-red-500"></div>

            <!-- Track Lane Marker -->
            <div class="absolute top-1/2 left-0 right-0 h-0.5 bg-white opacity-30"></div>

            <!-- Animated Horse -->
            <div
              class="horse-on-track absolute top-1/2 transform -translate-y-1/2"
              :style="{
                left: `${individualHorsePositions[result.horseId]}%`,
                transitionDuration: `${result.time}s`,
                transitionTimingFunction: 'ease-out',
              }"
            >
              <div class="horse-track-container flex items-center">
                <!-- Horse Icon -->
                <div
                  class="w-6 h-6 rounded-full border border-white flex items-center justify-center shadow-lg transform hover:scale-110 transition-transform duration-150"
                  :style="{ backgroundColor: result.horse.color.value }"
                >
                  <span class="text-white text-xs font-bold drop-shadow-lg">🐎</span>
                </div>
                <!-- Position Badge -->
                <div
                  v-if="race.state === 'completed'"
                  class="mt-0.5 w-4 h-4 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-md animate-badge-appear"
                  :class="getPositionColor(result.position)"
                  :style="{ animationDelay: `${result.position * 100}ms` }"
                >
                  {{ result.position }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Results Table -->
      <div v-if="race.state === 'completed'" class="results-table mt-4 sm:mt-6">
        <h4 class="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4 flex items-center">
          <span class="mr-2">📊</span>
          Race Results
        </h4>

        <!-- Mobile Card View -->
        <div class="block sm:hidden space-y-3">
          <div
            v-for="result in sortedResults"
            :key="result.horseId"
            class="bg-white border border-gray-200 rounded-lg p-3 shadow-sm"
            :class="{
              'bg-yellow-50 border-yellow-200': result.position === 1,
              'bg-gray-50 border-gray-300': result.position === 2,
              'bg-orange-50 border-orange-200': result.position === 3,
            }"
          >
            <div class="flex items-center justify-between mb-2">
              <div class="flex items-center space-x-2">
                <span class="text-lg font-bold text-gray-700">{{ result.position }}</span>
                <Badge :position="result.position" size="sm" />
              </div>
              <div class="text-right">
                <div class="text-sm font-semibold">{{ result.time }}s</div>
                <div class="text-xs text-gray-500">{{ result.speed }} m/s</div>
              </div>
            </div>
            <div class="flex items-center space-x-2 mb-2">
              <div
                class="w-6 h-6 rounded-full border border-gray-300 flex items-center justify-center"
                :style="{ backgroundColor: result.horse.color.value }"
              >
                <span class="text-white text-xs font-bold">🐎</span>
              </div>
              <span class="font-medium text-sm">{{ result.horse.name }}</span>
              <span class="text-xs text-gray-500">({{ result.horse.color.name }})</span>
            </div>
            <div class="flex justify-between text-xs text-gray-600">
              <span>Gap: {{ result.gap === 0 ? '-' : `+${result.gap}s` }}</span>
              <span>Distance: {{ result.distance }}m</span>
            </div>
          </div>
        </div>

        <!-- Desktop Table View -->
        <div class="hidden sm:block overflow-x-auto">
          <table
            class="w-full border-collapse border border-gray-200 rounded-lg bg-white shadow-sm"
          >
            <thead class="bg-gray-50">
              <tr>
                <th
                  class="border border-gray-200 px-3 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider"
                >
                  Position
                </th>
                <th
                  class="border border-gray-200 px-3 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider"
                >
                  Horse
                </th>
                <th
                  class="border border-gray-200 px-3 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider"
                >
                  Color
                </th>
                <th
                  class="border border-gray-200 px-3 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider"
                >
                  Time
                </th>
                <th
                  class="border border-gray-200 px-3 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider"
                >
                  Gap
                </th>
                <th
                  class="border border-gray-200 px-3 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider"
                >
                  Speed
                </th>
                <th
                  class="border border-gray-200 px-3 py-2 text-left text-xs font-medium text-gray-700 uppercase tracking-wider"
                >
                  Distance
                </th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(result, index) in sortedResults"
                :key="result.horseId"
                class="hover:bg-gray-50 transition-colors duration-100"
                :class="{
                  'bg-yellow-50': result.position === 1,
                  'bg-gray-50': result.position === 2,
                  'bg-orange-50': result.position === 3,
                }"
                :style="{ animationDelay: `${index * 25}ms` }"
              >
                <td class="border border-gray-200 px-3 py-2">
                  <div class="flex items-center space-x-2">
                    <span class="text-lg font-bold text-gray-700">{{ result.position }}</span>
                    <Badge
                      :position="result.position"
                      size="sm"
                      class="animate-badge-appear"
                      :style="{ animationDelay: `${result.position * 100}ms` }"
                    />
                  </div>
                </td>
                <td class="border border-gray-200 px-3 py-2">
                  <div class="flex items-center space-x-2">
                    <div
                      class="w-6 h-6 rounded-full border border-gray-300 flex items-center justify-center"
                      :style="{ backgroundColor: result.horse.color.value }"
                    >
                      <span class="text-white text-xs font-bold">🐎</span>
                    </div>
                    <span class="font-medium text-sm">{{ result.horse.name }}</span>
                  </div>
                </td>
                <td class="border border-gray-200 px-3 py-2 text-sm text-gray-600">
                  {{ result.horse.color.name }}
                </td>
                <td class="border border-gray-200 px-3 py-2 font-semibold text-sm">
                  <span v-if="race.state === 'completed'">{{ result.time }}s</span>
                </td>
                <td class="border border-gray-200 px-3 py-2 text-sm text-gray-600">
                  {{ result.gap === 0 ? '-' : `+${result.gap}s` }}
                </td>
                <td class="border border-gray-200 px-3 py-2 text-sm text-gray-600">
                  {{ result.speed }} m/s
                </td>
                <td class="border border-gray-200 px-3 py-2 text-sm text-gray-600">
                  {{ result.distance }}m
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="empty-state text-center py-12 min-h-[calc(20rem)]">
      <div class="text-6xl mb-4">🐎</div>
      <h3 class="text-xl font-semibold text-gray-600 mb-2">Ready to Race!</h3>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, nextTick, onUnmounted, onMounted } from 'vue'
import type { Race } from '../types/horse'
import { Badge } from './ui'
import { useGameStore } from '../stores/gameStore'

interface Props {
  race: Race
}

const props = defineProps<Props>()
const gameStore = useGameStore()

const isRunning = ref(false)
const isResetting = ref(false)
const individualHorsePositions = ref<Record<number, number>>({})
const raceStartTime = ref<number | null>(null)
const raceEndTime = ref<number | null>(null)
const raceProgressPercentage = ref(0)
const progressInterval = ref<NodeJS.Timeout | null>(null)
const showRoundMenu = ref(false)

// Computed properties
const originalOrderResults = computed(() => {
  if (!props.race.results) return []
  // Return results in the same order as the original horses array
  return props.race.horses.map((horse) => {
    const result = props.race.results?.find((r) => r.horseId === horse.id)
    return (
      result || { horseId: horse.id, horse, position: 0, time: 0, gap: 0, speed: 0, distance: 0 }
    )
  })
})

const sortedResults = computed(() => {
  if (!props.race.results) return []
  // Return results sorted by position (1st to last)
  return [...(props.race.results || [])].sort((a, b) => a.position - b.position)
})

// Function to update progress percentage
function updateProgressPercentage() {
  // If race is completed, show 100%
  if (props.race.state === 'completed') {
    raceProgressPercentage.value = 100
    return
  }

  // If race is not running or no start time, show 0%
  if (!raceStartTime.value || !isRunning.value) {
    raceProgressPercentage.value = 0
    return
  }

  // Calculate progress based on actual elapsed time
  const elapsed = Date.now() - raceStartTime.value

  // If we have a race end time, calculate progress based on actual duration
  if (raceEndTime.value) {
    const actualDuration = raceEndTime.value - raceStartTime.value
    const progress = Math.min((elapsed / actualDuration) * 100, 100)
    raceProgressPercentage.value = Math.max(0, progress)
    return
  }

  // For races in progress, estimate progress based on typical duration
  // but cap it at 95% until the race actually completes
  const estimatedDuration = props.race.actualDuration || 3000 // fallback to 3 seconds
  const progress = Math.min((elapsed / estimatedDuration) * 95, 95) // Cap at 95% until completion

  raceProgressPercentage.value = Math.max(0, progress)
}

// Watch for results changes to animate horses
watch(
  () => props.race.results,
  (newResults) => {
    if (newResults && newResults.length > 0) {
      animateIndividualTracks()
    }
  },
  { immediate: true },
)

// Watch for race state changes to sync progress bar
watch(
  () => props.race.state,
  (newState) => {
    if (newState === 'racing' && !isRunning.value) {
      // Race started from external source (like running all races)
      isRunning.value = true
      raceStartTime.value = Date.now()
      raceEndTime.value = null // Reset end time

      // Start progress tracking timer
      if (progressInterval.value) {
        clearInterval(progressInterval.value)
      }
      progressInterval.value = setInterval(() => {
        updateProgressPercentage()
      }, 100) // Update every 100ms for smooth progress
    } else if (newState === 'completed' && isRunning.value) {
      // Race completed - record the end time
      raceEndTime.value = Date.now()
      isRunning.value = false

      // Clear progress tracking timer
      if (progressInterval.value) {
        clearInterval(progressInterval.value)
        progressInterval.value = null
      }

      // Final progress update
      updateProgressPercentage()
    }

    // Update progress whenever state changes
    updateProgressPercentage()
  },
)

// Initialize progress on component mount
updateProgressPercentage()

// Click outside handler to close menu
function handleClickOutside(event: Event) {
  const target = event.target as HTMLElement
  if (!target.closest('.round-menu-container')) {
    showRoundMenu.value = false
  }
}

// Cleanup on component unmount
onUnmounted(() => {
  if (progressInterval.value) {
    clearInterval(progressInterval.value)
    progressInterval.value = null
  }
  document.removeEventListener('click', handleClickOutside)
})

// Add click outside listener on mount
onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

// Animate horses on individual tracks
async function animateIndividualTracks() {
  await nextTick()

  // Reset positions
  individualHorsePositions.value = {}

  // Set initial positions (all at start line)
  originalOrderResults.value.forEach((result) => {
    individualHorsePositions.value[result.horseId] = 5 // Start at 5% from left
  })

  // Wait for DOM to update initial positions, then animate all horses simultaneously
  await nextTick()

  // Small delay to ensure initial positions are rendered
  setTimeout(() => {
    // Animate horses to finish line based on their actual race time
    originalOrderResults.value.forEach((result) => {
      // Set all horses to finish position - CSS transition will handle the timing
      individualHorsePositions.value[result.horseId] = 85
    })
  }, 50) // Small delay to ensure initial positions are visible
}

function toggleRoundMenu() {
  showRoundMenu.value = !showRoundMenu.value
}

async function runRound() {
  if (isRunning.value) return

  showRoundMenu.value = false // Close menu

  try {
    isRunning.value = true
    raceStartTime.value = Date.now()
    raceEndTime.value = null // Reset end time

    // Start progress tracking with real-time updates
    if (progressInterval.value) {
      clearInterval(progressInterval.value)
    }
    progressInterval.value = setInterval(() => {
      updateProgressPercentage()
    }, 100) // Update every 100ms for smooth progress

    await gameStore.runSingleRound(props.race.id)

    // Record the end time when race completes
    raceEndTime.value = Date.now()
    updateProgressPercentage() // Final update

    // Clear progress tracking
    if (progressInterval.value) {
      clearInterval(progressInterval.value)
      progressInterval.value = null
    }
  } catch (error) {
    console.error('Error running round:', error)
    alert(`Error running round: ${error instanceof Error ? error.message : 'Unknown error'}`)
  } finally {
    isRunning.value = false
    // Don't reset raceStartTime and raceEndTime here - keep them for progress calculation
  }
}

async function resetRound() {
  if (isResetting.value) return

  showRoundMenu.value = false // Close menu

  const confirmed = confirm(
    `Are you sure you want to reset Round ${props.race.round}? This will clear all results and reset the race to pending state.`,
  )
  if (!confirmed) return

  try {
    isResetting.value = true
    gameStore.resetSingleRound(props.race.id)

    // Reset timing variables
    raceStartTime.value = null
    raceEndTime.value = null
    isRunning.value = false
    raceProgressPercentage.value = 0

    // Clear progress interval
    if (progressInterval.value) {
      clearInterval(progressInterval.value)
      progressInterval.value = null
    }
  } catch (error) {
    console.error('Error resetting round:', error)
    alert(`Error resetting round: ${error instanceof Error ? error.message : 'Unknown error'}`)
  } finally {
    isResetting.value = false
  }
}

function getPositionColor(position: number): string {
  switch (position) {
    case 1:
      return 'bg-yellow-500' // Gold
    case 2:
      return 'bg-gray-400' // Silver
    case 3:
      return 'bg-orange-600' // Bronze
    default:
      return 'bg-blue-500' // Blue
  }
}

function getStateIcon(state: string): string {
  switch (state) {
    case 'pending':
      return '⏳'
    case 'racing':
      return '🔄'
    case 'completed':
      return '🏆'
    default:
      return '🏁'
  }
}

function getStateText(state: string): string {
  switch (state) {
    case 'pending':
      return 'Pending'
    case 'racing':
      return 'Racing'
    case 'completed':
      return 'Completed'
    default:
      return 'Unknown'
  }
}

function getStateBadgeClasses(state: string): string {
  switch (state) {
    case 'pending':
      return 'bg-yellow-100 text-yellow-800 border border-yellow-200'
    case 'racing':
      return 'bg-blue-100 text-blue-800 border border-blue-200'
    case 'completed':
      return 'bg-green-100 text-green-800 border border-green-200'
    default:
      return 'bg-gray-100 text-gray-800 border border-gray-200'
  }
}

function getProgressStatusText(): string {
  if (props.race.state === 'completed') {
    if (raceStartTime.value && raceEndTime.value) {
      const actualDuration = raceEndTime.value - raceStartTime.value
      return `Completed (${(actualDuration / 1000).toFixed(1)}s)`
    }
    return 'Completed'
  }
  if (props.race.state === 'racing' || isRunning.value) {
    if (raceStartTime.value) {
      const elapsed = Date.now() - raceStartTime.value
      return `${Math.round(raceProgressPercentage.value)}% (${(elapsed / 1000).toFixed(1)}s)`
    }
    return `${Math.round(raceProgressPercentage.value)}%`
  }
  return 'Ready'
}
</script>

<style scoped>
/* Horse animation styles */
.horse-finish {
  transition: left ease-out;
}

/* Empty state animation */
.empty-state {
  animation: fadeIn 0.3s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Individual tracks animations */
.individual-track-container {
  animation: slideInFromLeft 0.3s ease-out forwards;
  opacity: 0;
  transform: translateX(-20px);
}

@keyframes slideInFromLeft {
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.horse-on-track {
  transition: left ease-out;
}

/* Individual track styling */
.individual-track {
  background: linear-gradient(45deg, #10b981, #059669, #047857);
  position: relative;
}

.individual-track::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: repeating-linear-gradient(
    90deg,
    transparent,
    transparent 10px,
    rgba(255, 255, 255, 0.1) 10px,
    rgba(255, 255, 255, 0.1) 11px
  );
}

/* Absolutely positioned track info styling */
.track-info {
  padding: 4px 8px;
  border-radius: 6px;
  transition: all 0.1s ease;
  color: white;
}

.track-info:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

/* Individual track container adjustments */
.individual-track-container {
  min-height: 40px; /* Ensure space for absolute positioned info */
}

/* Results table animations */
.results-table tbody tr {
  animation: fadeInUp 0.3s ease-out forwards;
  opacity: 0;
  transform: translateY(20px);
}

@keyframes fadeInUp {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Table styling enhancements */
.results-table table {
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.results-table th {
  background: linear-gradient(135deg, #f9fafb, #f3f4f6);
}

/* Podium highlighting */
.results-table tbody tr.bg-yellow-50 {
  border-left: 4px solid #f59e0b;
}

.results-table tbody tr.bg-gray-50 {
  border-left: 4px solid #6b7280;
}

.results-table tbody tr.bg-orange-50 {
  border-left: 4px solid #ea580c;
}

/* Badge appearance animation */
.animate-badge-appear {
  animation: badgeAppear 0.4s ease-out forwards;
  opacity: 0;
  transform: scale(0.5) rotate(-10deg);
}

@keyframes badgeAppear {
  0% {
    opacity: 0;
    transform: scale(0.5) rotate(-10deg);
  }
  50% {
    opacity: 0.8;
    transform: scale(1.1) rotate(5deg);
  }
  100% {
    opacity: 1;
    transform: scale(1) rotate(0deg);
  }
}
</style>
