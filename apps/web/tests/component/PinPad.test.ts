import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import PinPad from '../../app/components/kiosk/PinPad.vue'
import { primevueStubs } from '../stubs'

function mountPinPad() {
  return mount(PinPad, {
    global: { stubs: primevueStubs },
  })
}

describe('PinPad', () => {
  it('renders a numeric input with a submit button', () => {
    const wrapper = mountPinPad()
    expect(wrapper.find('[data-testid="pin-input"]').exists()).toBe(true)
    expect(wrapper.find('[data-testid="pin-submit"]').exists()).toBe(true)
  })

  it('emits "submit" with the entered PIN when submitted', async () => {
    const wrapper = mountPinPad()

    await wrapper.find('[data-testid="pin-input"]').setValue('1234')
    await wrapper.find('form').trigger('submit')

    expect(wrapper.emitted('submit')).toEqual([['1234']])
  })

  it('does not emit "submit" when PIN is empty', async () => {
    const wrapper = mountPinPad()

    await wrapper.find('[data-testid="pin-submit"]').trigger('click')

    expect(wrapper.emitted('submit')).toBeUndefined()
  })
})