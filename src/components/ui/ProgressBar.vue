<template>
  <div class="progress-bar-container">
    <div v-if="label" class="flex justify-between items-center mb-2">
      <span class="text-sm font-medium text-gray-700">{{ label }}</span>
      <span v-if="showValue" class="text-sm text-gray-600">{{ displayValue }}</span>
    </div>

    <div class="w-full bg-gray-200 rounded-full overflow-hidden" :class="heightClass">
      <div :class="progressClasses" :style="{ width: `${clampedValue}%` }"></div>
    </div>

    <div v-if="description" class="mt-1 text-xs text-gray-500">
      {{ description }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  value: number
  max?: number
  label?: string
  description?: string
  showValue?: boolean
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info'
  size?: 'sm' | 'md' | 'lg'
  animated?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  max: 100,
  showValue: true,
  variant: 'default',
  size: 'md',
  animated: true,
})

const clampedValue = computed(() => {
  const percentage = (props.value / props.max) * 100
  return Math.min(Math.max(percentage, 0), 100)
})

const displayValue = computed(() => {
  if (props.showValue) {
    return `${Math.round(props.value)}/${props.max}`
  }
  return ''
})

const heightClass = computed(() => {
  const heightClasses = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3',
  }
  return heightClasses[props.size]
})

const progressClasses = computed(() => {
  const baseClasses = ['h-full', 'rounded-full', 'transition-all', 'duration-500']

  // Variant colors
  const variantClasses = {
    default: ['bg-gray-500'],
    primary: ['bg-blue-500'],
    success: ['bg-green-500'],
    warning: ['bg-yellow-500'],
    danger: ['bg-red-500'],
    info: ['bg-cyan-500'],
  }

  // Animation
  const animationClasses = props.animated ? ['ease-out'] : []

  return [...baseClasses, ...variantClasses[props.variant], ...animationClasses]
})
</script>
