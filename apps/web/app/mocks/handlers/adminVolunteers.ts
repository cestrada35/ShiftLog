import { http, HttpResponse, delay } from 'msw'
import { admins, volunteers, shifts, projects } from '../fixtures/data'
import type { Volunteer, ErrorResponse, DashboardStats} from '~/lib/api'

const BASE = '/api'

function requireAdmin(request: Request): string | null {
  return request.headers.get('X-Admin-Id')
}

export const adminVolunteerHandlers = [
  http.get(`${BASE}/admin/volunteers`, async ({ request }) => {
    await delay(80)
    if (!requireAdmin(request)) {
      return HttpResponse.json<ErrorResponse>(
        { code: 'no_admin', message: 'No admin identity' },
        { status: 401 },
      )
    }
    return HttpResponse.json(volunteers)
  }),

  http.post(`${BASE}/admin/volunteers`, async ({ request }) => {
    await delay(120)
    if (!requireAdmin(request)) {
      return HttpResponse.json<ErrorResponse>(
        { code: 'no_admin', message: 'No admin identity' },
        { status: 401 },
      )
    }

    const body = (await request.json()) as { name: string }
    const trimmed = body.name?.trim() ?? ''
    if (!trimmed) {
      return HttpResponse.json<ErrorResponse>(
        { code: 'empty_name', message: 'Name cannot be empty' },
        { status: 400 },
      )
    }

    const volunteer: Volunteer = {
      id: crypto.randomUUID(),
      name: trimmed,
      isActive: true,
    }
    volunteers.push(volunteer)

    // Deterministic "generated" credentials for tests + dev.
    return HttpResponse.json(
      {
        volunteer,
        pin: '482915',
        password: 'demo-pass-xyz',
      },
      { status: 201 },
    )
  }),

  http.patch(`${BASE}/admin/volunteers/:id`, async ({ request, params }) => {
    await delay(80)
    if (!requireAdmin(request)) {
      return HttpResponse.json<ErrorResponse>(
        { code: 'no_admin', message: 'No admin identity' },
        { status: 401 },
      )
    }

    const id = params.id as string
    const index = volunteers.findIndex(v => v.id === id)
    if (index === -1) {
      return HttpResponse.json<ErrorResponse>(
        { code: 'not_found', message: 'Volunteer not found' },
        { status: 404 },
      )
    }

    const patch = (await request.json()) as { name?: string; isActive?: boolean }
    const updated: Volunteer = {
      ...volunteers[index],
      ...(patch.name !== undefined ? { name: patch.name } : {}),
      ...(patch.isActive !== undefined ? { isActive: patch.isActive } : {}),
    }
    volunteers[index] = updated

    return HttpResponse.json(updated)
  }),
]

http.get(`${BASE}/admin/dashboard/stats`, async ({ request }) => {
  await delay(80)
  if (!requireAdmin(request)) {
    return HttpResponse.json<ErrorResponse>(
      { code: 'no_admin', message: 'No admin identity' },
      { status: 401 },
    )
  }

  const activeVolunteers = volunteers.filter(v => v.isActive).length

  const recentShifts = shifts
    .slice()
    .sort((a, b) => b.startedAt.localeCompare(a.startedAt))
    .slice(0, 5)
    .map(s => {
      const vol = volunteers.find(v => v.id === s.volunteerId)
      const proj = projects.find(p => p.id === s.projectId)
      return {
        id: s.id,
        volunteerName: vol?.name ?? 'Unknown',
        projectName: proj?.name ?? 'Unknown',
        startedAt: s.startedAt,
        endedAt: s.endedAt,
      }
    })

  const todayIso = new Date().toISOString().slice(0, 10)
  const shiftsToday = shifts.filter(s => s.startedAt.startsWith(todayIso)).length

  return HttpResponse.json<DashboardStats>({
    totalVolunteers: volunteers.length,
    activeVolunteers,
    totalProjects: projects.length,
    activeProjects: projects.length,
    shiftsToday,
    recentShifts,
  })
})