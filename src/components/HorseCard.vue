<template>
  <div
    class="border-b transition-all duration-200"
    :class="{
      'bg-blue-50 border-blue-200 shadow-sm': isSelected,
      'hover:bg-gray-50': !isSelected,
    }"
  >
    <div class="flex items-center space-x-2 sm:space-x-3 px-2 py-2 sm:py-3">
      <!-- Horse Color Indicator -->
      <div
        class="w-8 h-8 sm:w-10 sm:h-10 rounded-full border flex items-center justify-center text-white transition-all duration-200 flex-shrink-0"
        :class="{
          'border-blue-400 shadow-md': isSelected,
          'border-gray-300': !isSelected,
        }"
        :style="{ backgroundColor: horse.color.value }"
      >
        <span class="text-sm sm:text-base">🐎</span>
      </div>

      <!-- Horse Info -->
      <div class="flex-1 min-w-0">
        <h3
          class="font-semibold text-sm sm:text-base transition-colors duration-200 truncate"
          :class="{
            'text-blue-800': isSelected,
            'text-gray-800': !isSelected,
          }"
        >
          {{ horse.name }}
        </h3>
        <p
          class="text-xs sm:text-sm transition-colors duration-200 truncate"
          :class="{
            'text-blue-600': isSelected,
            'text-gray-600': !isSelected,
          }"
        >
          {{ horse.color.name }}
        </p>
      </div>

      <!-- Condition Score -->
      <div class="text-right flex-shrink-0">
        <Badge :variant="getConditionVariant(horse.condition)" size="sm">
          {{ horse.condition }}
        </Badge>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Horse } from '../types/horse'
import { Badge } from './ui'

interface Props {
  horse: Horse
  isSelected?: boolean
}

defineProps<Props>()

function getConditionVariant(condition: number): 'success' | 'warning' | 'danger' | 'info' {
  if (condition >= 80) return 'success'
  if (condition >= 60) return 'warning'
  if (condition >= 40) return 'info'
  return 'danger'
}
</script>
