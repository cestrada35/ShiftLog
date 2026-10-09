import { http, HttpResponse, delay } from 'msw'
import { volunteers, projects, shifts, pinsByVolunteer } from '../fixtures/data'
import type { KioskAuthResponse, ErrorResponse, Shift } from '~/lib/api'

const BASE = '/api'

export const kioskHandlers = [
  http.post(`${BASE}/kiosk/auth`, async ({ request }) => {
    await delay(150)
    const body = (await request.json()) as { pin: string }
    const volunteerId = Object.entries(pinsByVolunteer)
      .find(([, pin]) => pin === body.pin)?.[0]

    if (!volunteerId) {
      return HttpResponse.json<ErrorResponse>(
        { code: 'invalid_pin', message: 'PIN not recognized' },
        { status: 401 },
      )
    }

    const volunteer = volunteers.find(v => v.id === volunteerId)!
    const activeShift = shifts.find(
      s => s.volunteerId === volunteer.id && s.endedAt === null,
    ) ?? null

    return HttpResponse.json({
      volunteer,
      activeShift,
    })
  }),

  http.get(`${BASE}/kiosk/projects`, async () => {
    await delay(100)
    return HttpResponse.json(projects)
  }),

  http.post(`${BASE}/kiosk/check-in`, async ({ request }) => {
    await delay(150)
    const body = (await request.json()) as { volunteerId: string; projectId: string }

    const existing = shifts.find(
      s => s.volunteerId === body.volunteerId && s.endedAt === null,
    )
    if (existing) {
      return HttpResponse.json<ErrorResponse>(
        { code: 'already_checked_in', message: 'Volunteer already has an active shift' },
        { status: 409 },
      )
    }

    const shift: Shift = {
      id: crypto.randomUUID(),
      volunteerId: body.volunteerId,
      projectId: body.projectId,
      startedAt: new Date().toISOString(),
      endedAt: null,
    }
    shifts.push(shift)
    return HttpResponse.json(shift, { status: 201 })
  }),

  http.post(`${BASE}/kiosk/check-out`, async ({ request }) => {
    await delay(150)
    const body = (await request.json()) as { shiftId: string }
    const shift = shifts.find(s => s.id === body.shiftId && s.endedAt === null)

    if (!shift) {
      return HttpResponse.json<ErrorResponse>(
        { code: 'no_active_shift', message: 'No active shift found' },
        { status: 409 },
      )
    }

    shift.endedAt = new Date().toISOString()
    return HttpResponse.json(shift)
  }),
]