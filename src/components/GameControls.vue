<template>
  <div class="">
    <div class="max-w-7xl mx-auto px-2 sm:px-4 py-2 sm:py-3">
      <div class="flex items-center justify-between">
        <!-- Control Buttons -->
        <div class="flex items-center space-x-2 sm:space-x-3">
          <!-- Reset Game Button -->
          <Button variant="outline" size="sm" @click="handleReset" class="text-xs sm:text-sm">
            <span>+</span>
            <span class="ml-1 hidden sm:inline">New Game</span>
            <span class="ml-1 sm:hidden">New</span>
          </Button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useGameStore } from '../stores/gameStore'
import { Button } from './ui'

const gameStore = useGameStore()

function handleReset() {
  try {
    gameStore.resetGame()
  } catch (error) {
    console.error('Error resetting game:', error)
  }
}
</script>
