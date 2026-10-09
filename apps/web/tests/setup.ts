import { afterAll, afterEach, beforeAll } from 'vitest'
import { server } from './msw'
import { resetFixtures } from '../app/mocks/fixtures/data'
import { vi } from 'vitest'

vi.stubGlobal('definePageMeta', () => {})
vi.stubGlobal('navigateTo', vi.fn())
vi.stubGlobal('useRoute', () => ({ path: '/', query: {}, params: {} }))
vi.stubGlobal('useRouter', () => ({ push: vi.fn(), replace: vi.fn() }))

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))

afterEach(() => {
  server.resetHandlers()
  resetFixtures()
})

afterAll(() => server.close())