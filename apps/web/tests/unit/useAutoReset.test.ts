import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { ref, nextTick } from 'vue'
import { useAutoReset } from '../../app/composables/useAutoReset'

describe('useAutoReset', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('does not start a countdown in non-trigger states', () => {
    const source = ref('idle')
    const onReset = vi.fn()
    const { countdown } = useAutoReset(source, ['completed'], {
      durationSeconds: 5,
      onReset,
    })

    expect(countdown.value).toBeNull()
    vi.advanceTimersByTime(10_000)
    expect(onReset).not.toHaveBeenCalled()
  })

  it('starts a countdown when entering a trigger state', async () => {
    const source = ref('idle')
    const { countdown } = useAutoReset(source, ['completed'], {
      durationSeconds: 5,
      onReset: vi.fn(),
    })

    source.value = 'completed'
    await nextTick()

    expect(countdown.value).toBe(5)
    vi.advanceTimersByTime(1_000)
    expect(countdown.value).toBe(4)
    vi.advanceTimersByTime(1_000)
    expect(countdown.value).toBe(3)
  })

  it('calls onReset when the countdown reaches zero', async () => {
    const source = ref('idle')
    const onReset = vi.fn()
    useAutoReset(source, ['completed'], {
      durationSeconds: 3,
      onReset,
    })

    source.value = 'completed'
    await nextTick()
    vi.advanceTimersByTime(3_000)

    expect(onReset).toHaveBeenCalledOnce()
  })

  it('cancels the countdown when leaving a trigger state', async () => {
    const source = ref('idle')
    const onReset = vi.fn()
    const { countdown } = useAutoReset(source, ['completed'], {
      durationSeconds: 5,
      onReset,
    })

    source.value = 'completed'
    await nextTick()
    vi.advanceTimersByTime(2_000)

    source.value = 'idle'
    await nextTick()

    expect(countdown.value).toBeNull()
    vi.advanceTimersByTime(10_000)
    expect(onReset).not.toHaveBeenCalled()
  })

  it('restarts the countdown when re-entering a trigger state', async () => {
    const source = ref('idle')
    const { countdown } = useAutoReset(source, ['completed'], {
      durationSeconds: 5,
      onReset: vi.fn(),
    })

    source.value = 'completed'
    await nextTick()
    vi.advanceTimersByTime(2_000)
    source.value = 'idle'
    await nextTick()
    source.value = 'completed'
    await nextTick()

    expect(countdown.value).toBe(5)
  })
})