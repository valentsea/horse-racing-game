<template>
  <div :class="statusClasses">
    <div class="flex items-center justify-between">
      <div class="flex items-center space-x-2">
        <div v-if="icon" class="flex-shrink-0" :class="iconClasses">
          {{ icon }}
        </div>
        <div>
          <div class="font-medium">{{ text }}</div>
          <div v-if="description" class="text-sm opacity-75">{{ description }}</div>
        </div>
      </div>
      <div v-if="$slots.action" class="flex-shrink-0">
        <slot name="action" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  variant?: 'idle' | 'generating' | 'racing' | 'completed' | 'error' | 'warning' | 'info'
  text: string
  description?: string
  icon?: string
  animated?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'idle',
  animated: false,
})

const statusClasses = computed(() => {
  const baseClasses = ['p-3', 'rounded-lg', 'border']

  const variantClasses = {
    idle: ['bg-blue-100', 'text-blue-800', 'border-blue-200'],
    generating: ['bg-yellow-100', 'text-yellow-800', 'border-yellow-200'],
    racing: ['bg-green-100', 'text-green-800', 'border-green-200'],
    completed: ['bg-purple-100', 'text-purple-800', 'border-purple-200'],
    error: ['bg-red-100', 'text-red-800', 'border-red-200'],
    warning: ['bg-orange-100', 'text-orange-800', 'border-orange-200'],
    info: ['bg-cyan-100', 'text-cyan-800', 'border-cyan-200'],
  }

  return [...baseClasses, ...variantClasses[props.variant]]
})

const iconClasses = computed(() => {
  const baseClasses = ['text-lg']

  if (props.animated) {
    const animationClasses = {
      generating: ['animate-spin'],
      racing: ['animate-pulse'],
    }
    return [
      ...baseClasses,
      ...(animationClasses[props.variant as keyof typeof animationClasses] || []),
    ]
  }

  return baseClasses
})
</script>
