import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import StatCard from '../../app/components/admin/StatCard.vue'
import { primevueStubs } from '../stubs'

describe('StatCard', () => {
  it('renders label and value', () => {
    const wrapper = mount(StatCard, {
      props: { label: 'Total Volunteers', value: 42, icon: 'pi pi-users' },
      global: { stubs: primevueStubs },
    })
    expect(wrapper.text()).toContain('Total Volunteers')
    expect(wrapper.text()).toContain('42')
  })

  it('uses the label to build a stable test id', () => {
    const wrapper = mount(StatCard, {
      props: { label: 'Shifts Today', value: 3, icon: 'pi pi-clock' },
      global: { stubs: primevueStubs },
    })
    expect(wrapper.find('[data-testid="stat-shifts-today"]').exists()).toBe(true)
  })
})