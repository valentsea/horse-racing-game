<template>
  <span :class="badgeClasses">
    <slot />
  </span>
</template>

<script setup lang="ts">
import { computed } from 'vue'

// Component name should be multi-word for Vue style guide compliance
defineOptions({
  name: 'AppBadge',
})

interface Props {
  variant?: 'default' | 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info'
  size?: 'sm' | 'md' | 'lg'
  rounded?: boolean
  position?: number // Special variant for race positions
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default',
  size: 'md',
  rounded: true,
})

const badgeClasses = computed(() => {
  const baseClasses = ['inline-flex', 'items-center', 'justify-center', 'font-bold']

  // Size classes
  const sizeClasses = {
    sm: ['px-2', 'py-1', 'text-xs'],
    md: ['px-3', 'py-1.5', 'text-sm'],
    lg: ['px-4', 'py-2', 'text-base'],
  }

  // Rounded classes
  const roundedClasses = props.rounded ? ['rounded-full'] : ['rounded-md']

  // Position-specific colors (for race positions)
  if (props.position) {
    const positionColors = {
      1: ['bg-yellow-500', 'text-white'], // Gold
      2: ['bg-gray-400', 'text-white'], // Silver
      3: ['bg-orange-600', 'text-white'], // Bronze
    }
    return [
      ...baseClasses,
      ...sizeClasses[props.size],
      ...roundedClasses,
      ...(positionColors[props.position as keyof typeof positionColors] || [
        'bg-blue-500',
        'text-white',
      ]),
    ]
  }

  // Regular variant classes
  const variantClasses = {
    default: ['bg-gray-100', 'text-gray-800'],
    primary: ['bg-blue-100', 'text-blue-800'],
    secondary: ['bg-gray-100', 'text-gray-800'],
    success: ['bg-green-100', 'text-green-800'],
    danger: ['bg-red-100', 'text-red-800'],
    warning: ['bg-yellow-100', 'text-yellow-800'],
    info: ['bg-cyan-100', 'text-cyan-800'],
  }

  return [
    ...baseClasses,
    ...sizeClasses[props.size],
    ...roundedClasses,
    ...variantClasses[props.variant],
  ]
})
</script>
