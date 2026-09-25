import { describe, it, expect } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import KioskPage from '../../app/pages/kiosk/index.vue'
import { primevueStubs } from '../stubs'

function mountKiosk() {
  return mount(KioskPage, {
    global: { stubs: primevueStubs },
  })
}

describe('Kiosk page', () => {
  it('starts with the PIN pad visible', () => {
    const wrapper = mountKiosk()
    expect(wrapper.find('[data-testid="pin-input"]').exists()).toBe(true)
  })

  it('shows a welcome message after a valid PIN', async () => {
    const wrapper = mountKiosk()

    await wrapper.find('[data-testid="pin-input"]').setValue('1234')
    await wrapper.find('form').trigger('submit')
    await flushPromises()

    expect(wrapper.text()).toContain('Ada Lovelace')
  })

  it('shows an error message after an invalid PIN', async () => {
    const wrapper = mountKiosk()

    await wrapper.find('[data-testid="pin-input"]').setValue('0000')
    await wrapper.find('form').trigger('submit')
    await flushPromises()

    expect(wrapper.text()).toContain('PIN not recognized')
  })
})