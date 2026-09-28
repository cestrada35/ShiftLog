import { afterAll, afterEach, beforeAll } from 'vitest'
import { server } from './msw'
import { resetFixtures } from '../app/mocks/fixtures/data'

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))

afterEach(() => {
  server.resetHandlers()
  resetFixtures()
})

afterAll(() => server.close())