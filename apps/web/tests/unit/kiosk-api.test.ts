import { describe, it, expect } from 'vitest'
import { authenticateByPin, ApiError } from '../../app/lib/api/kiosk'
import { server } from '../msw'
import { http, HttpResponse } from 'msw'

describe('authenticateByPin', () => {
  it('returns the volunteer and active shift on valid PIN', async () => {
    const result = await authenticateByPin('1234')

    expect(result.volunteer.name).toBe('Mark S.')
    expect(result.activeShift).toBeNull()
  })

  it('throws ApiError with code invalid_pin on bad PIN', async () => {
    await expect(authenticateByPin('0000')).rejects.toMatchObject({
      code: 'invalid_pin',
      status: 401,
    })
  })

  it('throws ApiError if the server errors', async () => {
    server.use(
      http.post('/api/kiosk/auth', () =>
        HttpResponse.json({ code: 'server_error', message: 'Boom' }, { status: 500 }),
      ),
    )

    await expect(authenticateByPin('1234')).rejects.toBeInstanceOf(ApiError)
  })
})