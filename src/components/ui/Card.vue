<template>
  <div class="bg-white rounded-lg border border-gray-200">
    <div v-if="$slots.header" class="card-header px-4 py-2 border-b border-gray-200">
      <slot name="header" />
    </div>

    <div class="">
      <slot />
    </div>

    <div v-if="$slots.footer" class="card-footer px-6 py-4 border-t border-gray-200">
      <slot name="footer" />
    </div>
  </div>
</template>

<script setup lang="ts">
defineOptions({
  name: 'BaseCard',
})
</script>
