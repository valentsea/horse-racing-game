import { computed, ref, watch, type Ref, type ComputedRef } from 'vue'

/**
 * Performance optimization utilities for Vue components
 */

/**
 * Creates a throttled version of a function
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  delay: number,
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout | null = null
  let lastExecTime = 0

  return function (this: any, ...args: Parameters<T>) {
    const currentTime = Date.now()

    if (currentTime - lastExecTime > delay) {
      func.apply(this, args)
      lastExecTime = currentTime
    } else {
      if (timeoutId) {
        clearTimeout(timeoutId)
      }
      timeoutId = setTimeout(
        () => {
          func.apply(this, args)
          lastExecTime = Date.now()
        },
        delay - (currentTime - lastExecTime),
      )
    }
  }
}

/**
 * Creates a debounced version of a function
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number,
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout | null = null

  return function (this: any, ...args: Parameters<T>) {
    if (timeoutId) {
      clearTimeout(timeoutId)
    }
    timeoutId = setTimeout(() => func.apply(this, args), delay)
  }
}

/**
 * Creates a memoized computed property that caches results
 */
export function memoizedComputed<T>(
  getter: () => T,
  deps: ComputedRef<any>[] = [],
): ComputedRef<T> {
  const cache = new Map<string, T>()
  const lastValues = ref<any[]>([])

  return computed(() => {
    const currentValues = deps.map((dep) => dep.value)
    const cacheKey = JSON.stringify(currentValues)

    // Check if dependencies have changed
    const hasChanged = currentValues.some((value, index) => value !== lastValues.value[index])

    if (hasChanged || !cache.has(cacheKey)) {
      const result = getter()
      cache.set(cacheKey, result)
      lastValues.value = currentValues
      return result
    }

    return cache.get(cacheKey)!
  })
}

/**
 * Creates a reactive map with optimized operations
 */
export function createReactiveMap<K, V>() {
  const map = ref(new Map<K, V>())

  return {
    get value() {
      return map.value
    },
    set: (key: K, value: V) => {
      map.value.set(key, value as any)
      map.value = new Map(map.value) // Trigger reactivity
    },
    get: (key: K) => map.value.get(key),
    has: (key: K) => map.value.has(key),
    delete: (key: K) => {
      const result = map.value.delete(key)
      map.value = new Map(map.value) // Trigger reactivity
      return result
    },
    clear: () => {
      map.value.clear()
      map.value = new Map(map.value) // Trigger reactivity
    },
    size: computed(() => map.value.size),
    keys: computed(() => Array.from(map.value.keys())),
    values: computed(() => Array.from(map.value.values())),
    entries: computed(() => Array.from(map.value.entries())),
  }
}

/**
 * Creates a batch update utility for multiple reactive values
 */
export function createBatchUpdater() {
  const updates = new Map<string, any>()
  let isBatching = false

  return {
    startBatch: () => {
      isBatching = true
      updates.clear()
    },
    endBatch: (applyUpdates: (updates: Map<string, any>) => void) => {
      if (isBatching) {
        applyUpdates(updates)
        isBatching = false
        updates.clear()
      }
    },
    addUpdate: (key: string, value: any) => {
      if (isBatching) {
        updates.set(key, value)
      }
    },
    isBatching: () => isBatching,
  }
}

/**
 * Creates a virtual scrolling utility for large lists
 */
export function createVirtualScroller(
  itemHeight: number,
  containerHeight: number,
  totalItems: ComputedRef<number>,
) {
  const scrollTop = ref(0)

  const visibleRange = computed(() => {
    const start = Math.floor(scrollTop.value / itemHeight)
    const end = Math.min(start + Math.ceil(containerHeight / itemHeight) + 1, totalItems.value)
    return { start, end }
  })

  const visibleItems = computed(() => {
    const { start, end } = visibleRange.value
    return Array.from({ length: end - start }, (_, i) => start + i)
  })

  const totalHeight = computed(() => totalItems.value * itemHeight)

  const offsetY = computed(() => visibleRange.value.start * itemHeight)

  return {
    scrollTop,
    visibleRange,
    visibleItems,
    totalHeight,
    offsetY,
  }
}

/**
 * Creates a performance monitor for tracking component performance
 */
export function createPerformanceMonitor(componentName: string) {
  const metrics = ref({
    renderCount: 0,
    lastRenderTime: 0,
    averageRenderTime: 0,
    totalRenderTime: 0,
  })

  const startRender = () => {
    return performance.now()
  }

  const endRender = (startTime: number) => {
    const renderTime = performance.now() - startTime
    metrics.value.renderCount++
    metrics.value.lastRenderTime = renderTime
    metrics.value.totalRenderTime += renderTime
    metrics.value.averageRenderTime = metrics.value.totalRenderTime / metrics.value.renderCount

    if (import.meta.env.DEV) {
      console.debug(
        `[${componentName}] Render #${metrics.value.renderCount}: ${renderTime.toFixed(2)}ms`,
      )
    }
  }

  return {
    metrics: computed(() => metrics.value),
    startRender,
    endRender,
  }
}

/**
 * Creates an optimized watcher that only triggers when values actually change
 */
export function createOptimizedWatcher<T>(
  source: () => T,
  callback: (newValue: T, oldValue: T) => void,
  options: { immediate?: boolean; deep?: boolean } = {},
) {
  let lastValue: T | undefined

  return watch(
    source,
    (newValue) => {
      if (newValue !== lastValue) {
        callback(newValue, lastValue!)
        lastValue = newValue
      }
    },
    options,
  )
}

/**
 * Creates a lazy computed property that only calculates when accessed
 */
export function createLazyComputed<T>(
  getter: () => T,
  deps: ComputedRef<any>[] = [],
): ComputedRef<T | undefined> {
  const isDirty = ref(true)
  let cachedValue: T | undefined

  // Watch dependencies to mark as dirty
  watch(
    deps,
    () => {
      isDirty.value = true
    },
    { deep: true },
  )

  return computed(() => {
    if (isDirty.value) {
      cachedValue = getter()
      isDirty.value = false
    }
    return cachedValue
  })
}
