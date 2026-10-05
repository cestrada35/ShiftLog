import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { setActivePinia, createPinia } from 'pinia'
import SignInPage from '../../app/pages/admin/sign-in.vue'
import { primevueStubs } from '../stubs'
import { setCurrentAdminId } from '../../app/lib/api/adminAuth'

vi.mock('vue-router', () => ({
  useRouter: () => ({ push: vi.fn() }),
  useRoute: () => ({ path: '/admin/sign-in' }),
}))

function mountPage() {
  return mount(SignInPage, {
    global: {
      stubs: {
        ...primevueStubs,
        Select: {
          props: ['modelValue', 'options', 'optionLabel', 'optionValue'],
          emits: ['update:modelValue'],
          template: `
            <select
              :value="modelValue"
              @change="$emit('update:modelValue', ($event.target as HTMLSelectElement).value)"
            >
              <option v-for="o in options" :key="o.id" :value="o.id">{{ o.name }}</option>
            </select>
          `,
        },
      },
      mocks: {
        navigateTo: vi.fn(),
      },
    },
  })
}

describe('Admin sign-in page', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    setCurrentAdminId(null)
    localStorage.clear()
  })

  it('loads admins and shows the picker', async () => {
    const wrapper = mount(SignInPage, {
      global: {
        stubs: {
          ...primevueStubs,
          Select: { template: '<div data-testid="select-stub" />' },
        },
      },
    })

    await vi.waitFor(() => {
      expect(wrapper.find('[data-testid="admin-select"]').exists()).toBe(true)
    })
    expect(wrapper.find('[data-testid="admin-sign-in"]').exists()).toBe(true)
  })
})
