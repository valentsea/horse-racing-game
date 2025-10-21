<template>
  <button :type="type" :disabled="disabled" :class="buttonClasses" @click="$emit('click', $event)">
    <slot />
  </button>
</template>

<script setup lang="ts">
// Component name should be multi-word for Vue style guide compliance
defineOptions({
  name: 'AppButton',
})
import { computed } from 'vue'

interface Props {
  variant?: 'primary' | 'secondary' | 'outline' | 'success' | 'danger' | 'warning' | 'info'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  loading?: boolean
  fullWidth?: boolean
  type?: 'button' | 'submit' | 'reset'
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md',
  disabled: false,
  loading: false,
  fullWidth: false,
  type: 'button',
})

defineEmits<{
  click: [event: MouseEvent]
}>()

const buttonClasses = computed(() => {
  const baseClasses = [
    'inline-flex',
    'items-center',
    'justify-center',
    'font-medium',
    'rounded-lg',
    'transition-all',
    'duration-200',
    'focus:outline-none',
    'focus:ring-2',
    'focus:ring-offset-2',
  ]

  // Size classes
  const sizeClasses = {
    sm: ['px-3', 'py-1.5', 'text-sm'],
    md: ['px-4', 'py-2', 'text-base'],
    lg: ['px-6', 'py-3', 'text-lg'],
  }

  // Variant classes
  const variantClasses = {
    primary: [
      'bg-blue-600',
      'text-white',
      'hover:bg-blue-700',
      'focus:ring-blue-500',
      'disabled:bg-blue-400',
    ],
    secondary: [
      'bg-gray-600',
      'text-white',
      'hover:bg-gray-700',
      'focus:ring-gray-500',
      'disabled:bg-gray-400',
    ],
    outline: [
      'bg-transparent',
      'text-gray-700',
      'border',
      'border-gray-300',
      'hover:bg-gray-50',
      'focus:ring-gray-500',
      'disabled:bg-gray-100',
      'disabled:text-gray-400',
    ],
    success: [
      'bg-green-600',
      'text-white',
      'hover:bg-green-700',
      'focus:ring-green-500',
      'disabled:bg-green-400',
    ],
    danger: [
      'bg-red-600',
      'text-white',
      'hover:bg-red-700',
      'focus:ring-red-500',
      'disabled:bg-red-400',
    ],
    warning: [
      'bg-yellow-600',
      'text-white',
      'hover:bg-yellow-700',
      'focus:ring-yellow-500',
      'disabled:bg-yellow-400',
    ],
    info: [
      'bg-cyan-600',
      'text-white',
      'hover:bg-cyan-700',
      'focus:ring-cyan-500',
      'disabled:bg-cyan-400',
    ],
  }

  // Disabled state
  const disabledClasses = props.disabled ? ['opacity-50', 'cursor-not-allowed'] : []

  // Full width
  const widthClasses = props.fullWidth ? ['w-full'] : []

  return [
    ...baseClasses,
    ...sizeClasses[props.size],
    ...variantClasses[props.variant],
    ...disabledClasses,
    ...widthClasses,
  ]
})
</script>
