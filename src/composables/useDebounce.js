// src/composables/useDebounce.js
import { onUnmounted } from 'vue'

export function useDebounce(fn, delay = 300) {
  let timeoutId = null

  const cancel = () => {
    if (timeoutId) {
      clearTimeout(timeoutId)
      timeoutId = null
    }
  }

  const debouncedFn = (...args) => {
    cancel()
    timeoutId = setTimeout(() => {
      fn(...args)
    }, delay)
  }

  onUnmounted(cancel)

  return debouncedFn
}
