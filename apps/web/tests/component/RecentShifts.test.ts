import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import RecentShifts from '../../app/components/admin/RecentShifts.vue'
import type { RecentShift } from '../../app/lib/api'
import { primevueStubs } from '../stubs'

const SAMPLE: RecentShift[] = [
  {
    id: 's1',
    volunteerName: 'Mark S.',
    projectName: 'Kitchen',
    startedAt: '2026-01-01T09:00:00Z',
    endedAt: '2026-01-01T13:00:00Z',
  },
]

function mountShifts(shifts: RecentShift[] = SAMPLE) {
  return mount(RecentShifts, {
    props: { shifts },
    global: { stubs: primevueStubs },
  })
}

describe('RecentShifts', () => {
  it('renders the empty state', () => {
    const wrapper = mountShifts([])
    expect(wrapper.find('[data-testid="recent-shifts-empty"]').exists()).toBe(true)
  })

  it('renders one row per shift', () => {
    const wrapper = mountShifts()
    expect(wrapper.find('[data-testid="recent-shifts-table"]').exists()).toBe(true)
    expect(wrapper.text()).toContain('Mark S.')
    expect(wrapper.text()).toContain('Kitchen')
  })

  it('shows a dash for active shifts', () => {
    const wrapper = mountShifts([
      { ...SAMPLE[0], endedAt: null },
    ])
    expect(wrapper.text()).toContain('—')
  })

  it('formats duration', () => {
    const wrapper = mountShifts()
    expect(wrapper.text()).toContain('4h 0m')
  })
})