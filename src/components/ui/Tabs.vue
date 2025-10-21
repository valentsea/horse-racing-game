<template>
  <div class="tabs-container">
    <!-- Tab Headers -->
    <div class="flex border border-gray-200 bg-white rounded-t-lg">
      <div class="flex flex-1">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          @click="selectTab(tab.id)"
          :disabled="tab.disabled"
          class="px-4 py-3 text-sm font-medium transition-colors duration-200 border-b-2"
          :class="[
            tab.disabled
              ? 'text-gray-400 border-transparent cursor-not-allowed opacity-50'
              : activeTab === tab.id
                ? 'text-blue-600 border-blue-600 bg-blue-50'
                : 'text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300',
          ]"
        >
          <div class="flex items-center space-x-2">
            <span>{{ tab.label }}</span>
            <span v-if="tab.badge" class="ml-2 px-2 py-1 text-xs rounded-full border text-gray-600">
              {{ tab.badge }}
            </span>
          </div>
        </button>
      </div>

      <!-- Right side controls -->
      <div class="flex items-center space-x-2 px-4 border-l border-gray-200">
        <!-- Start the game button -->
        <button
          v-if="showStartButton"
          @click="$emit('start-game')"
          :disabled="!canStartGame || isRacing"
          class="px-3 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed rounded-md transition-colors flex items-center space-x-1"
        >
          <span v-if="isRacing" class="animate-pulse">🏃‍♂️</span>
          <span v-else>🏁</span>
          <span>{{ isRacing ? 'Racing...' : 'Start the game' }}</span>
        </button>

        <!-- Reset All Rounds menu -->
        <div class="relative reset-menu-container" v-if="showResetMenu">
          <button
            @click="toggleResetMenu"
            class="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
            :disabled="isRacing"
          >
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z"
              />
            </svg>
          </button>

          <!-- Dropdown menu -->
          <div
            v-if="showResetDropdown"
            class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-10"
          >
            <div class="py-1">
              <button
                @click="$emit('new-schedule')"
                class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                :disabled="!canGenerateSchedule"
              >
                <span>📅</span>
                <span>New schedule</span>
              </button>
              <button
                @click="$emit('reset-all-rounds')"
                class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                :disabled="isRacing"
              >
                <span>🔄</span>
                <span>Reset All Rounds</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Tab Content -->
    <div class="tab-content bg-white rounded-b-lg border border-t-0 border-gray-200">
      <slot :activeTab="activeTab" :tabs="tabs" />
    </div>
  </div>
</template>

<script setup lang="ts">
// Component name should be multi-word for Vue style guide compliance
defineOptions({
  name: 'AppTabs',
})
import { ref, watch, onMounted, onUnmounted } from 'vue'

export interface Tab {
  id: string | number
  label: string
  icon?: string
  badge?: string | number
  disabled?: boolean // Added disabled property
}

interface Props {
  tabs: Tab[]
  defaultTab?: string | number
  showStartButton?: boolean
  showResetMenu?: boolean
  canStartGame?: boolean
  canGenerateSchedule?: boolean
  isRacing?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  showStartButton: false,
  showResetMenu: false,
  canStartGame: false,
  canGenerateSchedule: false,
  isRacing: false,
})

const emit = defineEmits<{
  'start-game': []
  'new-schedule': []
  'reset-all-rounds': []
}>()

const activeTab = ref(props.defaultTab || props.tabs[0]?.id)
const showResetDropdown = ref(false)

function selectTab(tabId: string | number) {
  const tab = props.tabs.find((t) => t.id === tabId)
  if (tab && !tab.disabled) {
    activeTab.value = tabId
  }
}

function toggleResetMenu() {
  showResetDropdown.value = !showResetDropdown.value
}

// Click outside handler to close reset menu
function handleClickOutside(event: Event) {
  const target = event.target as HTMLElement
  if (!target.closest('.reset-menu-container')) {
    showResetDropdown.value = false
  }
}

// Watch for changes in tabs to reset active tab if needed
watch(
  () => props.tabs,
  (newTabs) => {
    if (newTabs.length > 0 && !newTabs.find((tab) => tab.id === activeTab.value)) {
      activeTab.value = newTabs[0]?.id
    }
  },
  { immediate: true },
)

// Watch for changes in defaultTab to switch tabs externally
watch(
  () => props.defaultTab,
  (newDefaultTab) => {
    if (newDefaultTab && props.tabs.find((tab) => tab.id === newDefaultTab)) {
      activeTab.value = newDefaultTab
    }
  },
)

// Add click outside listener on mount
onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

// Cleanup on component unmount
onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

defineExpose({
  activeTab,
  selectTab,
})
</script>

<style scoped>
.tabs-container {
  @apply w-full;
}

.tab-content {
  min-height: 200px;
}
</style>
