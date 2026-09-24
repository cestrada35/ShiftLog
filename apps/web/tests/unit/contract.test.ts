import { describe, it, expectTypeOf } from 'vitest'
import type { Shift } from '../../app/lib/api'

describe('API contract', () => {
  it('Shift has the expected shape', () => {
    expectTypeOf<Shift>().toHaveProperty('volunteerId')
    expectTypeOf<Shift>().toHaveProperty('startedAt')
    expectTypeOf<Shift>().toHaveProperty('endedAt')
    expectTypeOf<Shift['endedAt']>().toEqualTypeOf<string | null>()
  })
})