import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import VolunteerTable from '../../app/components/admin/VolunteerTable.vue'
import type { Volunteer } from '../../app/lib/api'
import { primevueStubs } from '../stubs'

const SAMPLE: Volunteer[] = [
  { id: 'v1', name: 'Mark S.', isActive: true },
  { id: 'v2', name: 'Alan Turing', isActive: false },
]

function mountTable(props: Partial<{ volunteers: Volunteer[]; loading: boolean }> = {}) {
  return mount(VolunteerTable, {
    props: {
      volunteers: props.volunteers ?? SAMPLE,
      loading: props.loading ?? false,
    },
    global: { stubs: primevueStubs },
  })
}

describe('VolunteerTable', () => {
  it('renders one row per volunteer', () => {
    const wrapper = mountTable()
    expect(wrapper.findAll('[data-testid^="volunteer-row-"]')).toHaveLength(2)
  })

  it('shows Active for active volunteers and Inactive for others', () => {
    const wrapper = mountTable()
    expect(wrapper.get('[data-testid="volunteer-status-v1"]').text()).toBe('Active')
    expect(wrapper.get('[data-testid="volunteer-status-v2"]').text()).toBe('Inactive')
  })

  it('shows a loading state', () => {
    const wrapper = mountTable({ loading: true })
    expect(wrapper.find('[data-testid="volunteer-loading"]').exists()).toBe(true)
  })

  it('shows an empty state', () => {
    const wrapper = mountTable({ volunteers: [] })
    expect(wrapper.find('[data-testid="volunteer-empty"]').exists()).toBe(true)
  })

  it('emits toggle-active with the flipped state', async () => {
    const wrapper = mountTable()
    await wrapper.find('[data-testid="volunteer-toggle-v1"]').trigger('click')
    await wrapper.find('[data-testid="volunteer-toggle-v2"]').trigger('click')

    const events = wrapper.emitted('toggle-active') as [string, boolean][]
    expect(events).toEqual([
      ['v1', false],   // v1 was active → flip to false
      ['v2', true],    // v2 was inactive → flip to true
    ])
  })
})