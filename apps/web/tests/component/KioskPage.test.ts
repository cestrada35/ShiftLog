import { describe, it, expect, vi } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import KioskPage from '../../app/pages/kiosk/index.vue'
import PinPad from '../../app/components/kiosk/PinPad.vue'
import ProjectPicker from '../../app/components/kiosk/ProjectPicker.vue'
import { primevueStubs } from '../stubs'

function mountKiosk() {
  return mount(KioskPage, {
    global: { stubs: primevueStubs },
    components: { PinPad, ProjectPicker },
  })
}

describe('Kiosk page', () => {
  it('starts with the PIN pad visible', () => {
    const wrapper = mountKiosk()
    expect(wrapper.find('[data-testid="pin-input"]').exists()).toBe(true)
  })

  it('shows the project picker after a valid PIN with no active shift', async () => {
    const wrapper = mountKiosk()

    await wrapper.find('[data-testid="pin-input"]').setValue('1234')
    await wrapper.find('form').trigger('submit')
    await flushPromises()

    await vi.waitFor(() => {
        expect(wrapper.text()).toContain('Mark S.')
        expect(wrapper.find('[data-testid="project-picker"]').exists()).toBe(true)
        expect(wrapper.find('[data-testid="check-in"]').exists()).toBe(true)
    })
  })

  it('shows an error message after an invalid PIN', async () => {
    const wrapper = mountKiosk()

    await wrapper.find('[data-testid="pin-input"]').setValue('0000')
    await wrapper.find('form').trigger('submit')

    await vi.waitFor(() => {
        expect(wrapper.text()).toContain('PIN not recognized')
    })
  })
  
  it('shows a confirmation screen after check-out', async () => {
    const wrapper = mountKiosk()

    // identify and check in
    await wrapper.find('[data-testid="pin-input"]').setValue('1234')
    await wrapper.find('form').trigger('submit')
    await vi.waitFor(() => {
        expect(wrapper.find('[data-testid="check-in"]').exists()).toBe(true)
    })

    await wrapper.find('[role="radio"]').trigger('click')
    await wrapper.find('[data-testid="check-in"]').trigger('click')
    await vi.waitFor(() => {
        expect(wrapper.find('[data-testid="check-out"]').exists()).toBe(true)
    })

    // check out
    await wrapper.find('[data-testid="check-out"]').trigger('click')
    await vi.waitFor(() => {
        expect(wrapper.find('[data-testid="completed"]').exists()).toBe(true)
    })
  })
})