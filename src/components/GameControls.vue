<template>
  <div class="">
    <div class="max-w-7xl mx-auto px-4 py-3">
      <div class="flex items-center justify-between">
        <!-- Control Buttons -->
        <div class="flex items-center space-x-3">
          <!-- Reset Game Button -->
          <Button
            variant="outline"
            size="sm"
            :disabled="gameStore.gameState === 'racing'"
            @click="handleReset"
          >
            <span>🗑️</span>
            <span class="ml-1">New Game</span>
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
