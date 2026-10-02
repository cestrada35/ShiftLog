import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import CredentialsCard from '../../app/components/admin/CredentialsCard.vue'
import { primevueStubs } from '../stubs'

function mountCard() {
  return mount(CredentialsCard, {
    props: {
      volunteerName: 'Grace Hopper',
      pin: '482915',
      password: 'demo-pass-xyz',
    },
    global: { stubs: primevueStubs },
  })
}

describe('CredentialsCard', () => {
  const writeText = vi.fn().mockResolvedValue(undefined)

  beforeEach(() => {
    writeText.mockClear()
    vi.stubGlobal('navigator', {
      ...navigator,
      clipboard: { writeText },
    })
  })

  it('shows the volunteer name, PIN, and password', () => {
    const wrapper = mountCard()
    expect(wrapper.text()).toContain('Grace Hopper')
    expect(wrapper.get('[data-testid="credentials-pin"]').text()).toBe('482915')
    expect(wrapper.get('[data-testid="credentials-password"]').text()).toBe('demo-pass-xyz')
  })

  it('copies the PIN to the clipboard', async () => {
    const wrapper = mountCard()
    await wrapper.get('[data-testid="copy-pin"]').trigger('click')
    expect(writeText).toHaveBeenCalledWith('482915')
    expect(wrapper.get('[data-testid="copy-pin"]').text()).toContain('Copied')
  })

  it('emits done when the Done button is clicked', async () => {
    const wrapper = mountCard()
    await wrapper.get('[data-testid="credentials-done"]').trigger('click')
    expect(wrapper.emitted('done')).toEqual([[]])
  })
})