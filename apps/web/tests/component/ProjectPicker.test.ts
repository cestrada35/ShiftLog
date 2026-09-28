import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ProjectPicker from '../../app/components/kiosk/ProjectPicker.vue'
import type { Project } from '../../app/lib/api'

const projects: Project[] = [
  { id: 'p1', name: 'Kitchen', description: 'Meal prep' },
  { id: 'p2', name: 'Garden', description: 'Outdoor work' },
]

function mountPicker(props: Partial<{ selectedId: string | null; disabled: boolean }> = {}) {
  return mount(ProjectPicker, {
    props: {
      projects,
      selectedId: props.selectedId ?? null,
      disabled: props.disabled ?? false,
    },
  })
}

describe('ProjectPicker', () => {
  it('renders one option per project', () => {
    const wrapper = mountPicker()
    expect(wrapper.findAll('[role="radio"]')).toHaveLength(2)
  })

  it('marks the selected option with aria-checked', () => {
    const wrapper = mountPicker({ selectedId: 'p2' })
    const radios = wrapper.findAll('[role="radio"]')
    expect(radios[0].attributes('aria-checked')).toBe('false')
    expect(radios[1].attributes('aria-checked')).toBe('true')
  })

  it('emits select on click', async () => {
    const wrapper = mountPicker()
    await wrapper.findAll('[role="radio"]')[1].trigger('click')
    expect(wrapper.emitted('select')).toEqual([['p2']])
  })

  it('does not emit when disabled', async () => {
    const wrapper = mountPicker({ disabled: true })
    await wrapper.findAll('[role="radio"]')[0].trigger('click')
    expect(wrapper.emitted('select')).toBeUndefined()
  })
})