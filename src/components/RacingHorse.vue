<template>
  <div class="racing-horse-container relative h-12 mb-2">
    <div
      class="racing-horse absolute top-0 flex items-center space-x-2"
      :class="{
        'animate-pulse': isAnimating && progress < 100,
        'animate-bounce': position === 1 && progress === 100,
      }"
      :style="{
        left: `${progress}%`,
        transform: 'translateX(-100%)',
      }"
    >
      <!-- Horse Name -->
      <span class="text-sm font-medium text-gray-700 whitespace-nowrap">
        {{ horse.name }}
      </span>
      <!-- Horse Icon -->
      <div class="w-8 h-8 flex items-center justify-center">
        <svg
          width="32"
          height="32"
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          class="drop-shadow-sm"
        >
          <!-- Horse Body -->
          <path
            d="M8 20C8 18 10 16 12 16C14 16 16 18 16 20C16 22 14 24 12 24C10 24 8 22 8 20Z"
            :fill="horse.color.value"
            stroke="#8B4513"
            stroke-width="1"
          />
          <!-- Horse Head -->
          <path
            d="M20 12C22 12 24 14 24 16C24 18 22 20 20 20C18 20 16 18 16 16C16 14 18 12 20 12Z"
            :fill="horse.color.value"
            stroke="#8B4513"
            stroke-width="1"
          />
          <!-- Horse Neck -->
          <path
            d="M16 16C16 16 18 18 20 18C20 18 18 16 16 16Z"
            :fill="horse.color.value"
            stroke="#8B4513"
            stroke-width="1"
          />
          <!-- Horse Legs -->
          <rect
            x="9"
            y="22"
            width="2"
            height="6"
            :fill="horse.color.value"
            stroke="#8B4513"
            stroke-width="0.5"
          />
          <rect
            x="13"
            y="22"
            width="2"
            height="6"
            :fill="horse.color.value"
            stroke="#8B4513"
            stroke-width="0.5"
          />
          <!-- Horse Tail -->
          <path
            d="M6 18C4 18 2 20 2 22C2 24 4 26 6 26C8 26 8 24 8 22C8 20 7 18 6 18Z"
            :fill="horse.color.value"
            stroke="#8B4513"
            stroke-width="1"
          />
          <!-- Horse Mane -->
          <path
            d="M22 10C24 10 26 12 26 14C26 16 24 18 22 18C20 18 20 16 20 14C20 12 21 10 22 10Z"
            :fill="horse.color.value"
            stroke="#8B4513"
            stroke-width="1"
          />
          <!-- Horse Eye -->
          <circle cx="22" cy="15" r="1" fill="#000" />
          <!-- Horse Ear -->
          <path
            d="M24 8C25 8 26 9 26 10C26 11 25 12 24 12C23 12 22 11 22 10C22 9 23 8 24 8Z"
            :fill="horse.color.value"
            stroke="#8B4513"
            stroke-width="0.5"
          />
        </svg>
      </div>

      <!-- Dust Trail Effect -->
      <div
        v-if="isAnimating && progress > 0 && progress < 100"
        class="dust-trail absolute -left-8 top-1/2 transform -translate-y-1/2"
      >
        <div class="flex space-x-1">
          <div
            class="w-1 h-1 bg-gray-400 rounded-full animate-ping"
            style="animation-delay: 0ms"
          ></div>
          <div
            class="w-1 h-1 bg-gray-400 rounded-full animate-ping"
            style="animation-delay: 100ms"
          ></div>
          <div
            class="w-1 h-1 bg-gray-400 rounded-full animate-ping"
            style="animation-delay: 200ms"
          ></div>
        </div>
      </div>

      <!-- Position Badge -->
      <div
        v-if="position && progress === 100"
        class="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white"
        :class="getPositionColor(position)"
      >
        {{ position }}
      </div>
    </div>

    <!-- Finish Line Indicator -->
    <div class="absolute top-0 right-0 w-1 h-12 bg-red-500"></div>
  </div>
</template>

<script setup lang="ts">
import type { Horse } from '../types/horse'

interface Props {
  horse: Horse
  progress: number // 0-100
  raceDuration: number // in milliseconds
  position?: number
  isAnimating?: boolean
}

defineProps<Props>()

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
</script>
