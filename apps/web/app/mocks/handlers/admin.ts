import { http, HttpResponse, delay } from 'msw'
import type { Admin, ErrorResponse } from '~/lib/api'

const ADMINS: Record<string, Admin> = {
  'aaaaaaaa-0000-4000-8000-000000000001': {
    id: 'aaaaaaaa-0000-4000-8000-000000000001',
    email: 'admin@shiftlog.local',
    name: 'Admin One',
  },
}

export const adminHandlers = [
  http.get('/api/admin/whoami', async ({ request }) => {
    await delay(80)
    const adminId = request.headers.get('X-Admin-Id')
    if (!adminId) {
      return HttpResponse.json<ErrorResponse>(
        { code: 'no_admin', message: 'No admin identity' },
        { status: 401 },
      )
    }
    const admin = ADMINS[adminId]
    if (!admin) {
      return HttpResponse.json<ErrorResponse>(
        { code: 'unknown_admin', message: 'Unknown or inactive admin' },
        { status: 401 },
      )
    }
    return HttpResponse.json(admin)
  }),
]
