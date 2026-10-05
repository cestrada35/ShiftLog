import { ref, watch, onUnmounted, getCurrentInstance, type Ref } from 'vue'

export interface UseAutoResetOptions<T> {
  durationSeconds: number
  onReset: () => void
  /** Optional hook fired when the countdown ticks. Useful for UI updates. */
  onTick?: (secondsRemaining: number) => void
}

export function useAutoReset<T>(
  source: Ref<T>,
  triggerOn: T[],
  options: UseAutoResetOptions<T>,
) {
  const countdown = ref<number | null>(null)
  let interval: ReturnType<typeof setInterval> | null = null

  function clear() {
    if (interval !== null) {
      clearInterval(interval)
      interval = null
    }
    countdown.value = null
  }

  function start() {
    countdown.value = options.durationSeconds
    options.onTick?.(countdown.value)
    interval = setInterval(() => {
      if (countdown.value === null) return
      countdown.value -= 1
      options.onTick?.(countdown.value)
      if (countdown.value <= 0) {
        clear()
        options.onReset()
      }
    }, 1_000)
  }

  watch(source, (value) => {
    clear()
    if (triggerOn.includes(value)) {
      start()
    }
  })

  // Guard against being called outside a component context (e.g., bare tests).
  if (getCurrentInstance()) {
    onUnmounted(clear)
  }

  return { countdown, clear }
}