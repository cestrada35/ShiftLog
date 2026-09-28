import type { Volunteer, Project, Shift } from '~/lib/api'

export const volunteers: Volunteer[] = [
  { id: '11111111-1111-4111-8111-111111111111', name: 'Mark S.' },
  { id: '22222222-2222-4222-8222-222222222222', name: 'Dylan G.' },
]

export const projects: Project[] = [
  { id: 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', name: 'Cold Harbor', description: 'Feel the numbers' },
  { id: 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb', name: 'Siena', description: 'Stuff' },
]

export const pinsByVolunteer: Record<string, string> = {
  '11111111-1111-4111-8111-111111111111': '1234',
  '22222222-2222-4222-8222-222222222222': '5678',
}

// Mutable shifts
export let shifts: Shift[] = []

export function resetFixtures() {
  shifts = []
}