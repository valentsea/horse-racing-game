<template>
  <div
    class="border-b transition-all duration-200"
    :class="{
      'bg-blue-50 border-blue-200 shadow-sm': isSelected,
      'hover:bg-gray-50': !isSelected,
    }"
  >
    <div class="flex items-center space-x-3 px-2 py-2">
      <!-- Horse Color Indicator -->
      <div
        class="w-10 h-10 rounded-full border flex items-center justify-center text-white transition-all duration-200"
        :class="{
          'border-blue-400 shadow-md': isSelected,
          'border-gray-300': !isSelected,
        }"
        :style="{ backgroundColor: horse.color.value }"
      >
        🐎
      </div>

      <!-- Horse Info -->
      <div class="flex-1">
        <h3
          class="font-semibold transition-colors duration-200"
          :class="{
            'text-blue-800': isSelected,
            'text-gray-800': !isSelected,
          }"
        >
          {{ horse.name }}
        </h3>
        <p
          class="text-sm transition-colors duration-200"
          :class="{
            'text-blue-600': isSelected,
            'text-gray-600': !isSelected,
          }"
        >
          {{ horse.color.name }}
        </p>
      </div>

      <!-- Condition Score -->
      <div class="text-right">
        <Badge :variant="getConditionVariant(horse.condition)" size="md">
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
