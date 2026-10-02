import type { Volunteer, Project, Shift, Admin } from '~/lib/api'

const INITIAL_VOLUNTEERS: Volunteer[] = [
  { id: '11111111-1111-4111-8111-111111111111', name: 'Mark S.', isActive: true },
  { id: '22222222-2222-4222-8222-222222222222', name: 'Alan Turing', isActive: true },
]

export let volunteers = [...INITIAL_VOLUNTEERS]

export const projects: Project[] = [
  { id: 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa', name: 'Community Kitchen', description: 'Meal prep and distribution' },
  { id: 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbbb', name: 'Garden Restoration', description: 'Outdoor site work' },
]

export const pinsByVolunteer: Record<string, string> = {
  '11111111-1111-4111-8111-111111111111': '1234',
  '22222222-2222-4222-8222-222222222222': '5678',
}

export let shifts: Shift[] = []

export const admins: Record<string, Admin> = {
  'aaaaaaaa-0000-4000-8000-000000000001': {
    id: 'aaaaaaaa-0000-4000-8000-000000000001',
    email: 'admin@shiftlog.local',
    name: 'Admin One',
  },
}

export function resetFixtures() {
  shifts = []
  volunteers = [...INITIAL_VOLUNTEERS]
}