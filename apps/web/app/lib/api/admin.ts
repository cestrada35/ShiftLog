import type { Admin, Volunteer } from '~/lib/api'
import { request, ApiError } from './http'
import { getCurrentAdminId } from './adminAuth'

export { ApiError } from './http'

function adminRequest<T>(url: string, init?: RequestInit): Promise<T> {
  const adminId = getCurrentAdminId()
  if (!adminId) {
    return Promise.reject(new ApiError('no_admin', 'No admin identity set', 401))
  }
  return request<T>(url, {
    ...init,
    headers: {
      ...(init?.headers ?? {}),
      'X-Admin-Id': adminId,
    },
  })
}

export function whoami(): Promise<Admin> {
  return adminRequest<Admin>('/api/admin/whoami')
}

export function listVolunteers(): Promise<Volunteer[]> {
  return adminRequest<Volunteer[]>('/api/admin/volunteers')
}

export interface CreateVolunteerResponse {
  volunteer: Volunteer
  pin: string
  password: string
}

export function createVolunteer(name: string): Promise<CreateVolunteerResponse> {
  return adminRequest<CreateVolunteerResponse>('/api/admin/volunteers', {
    method: 'POST',
    body: JSON.stringify({ name }),
  })
}

export function updateVolunteer(
  volunteerId: string,
  patch: { name?: string; isActive?: boolean },
): Promise<Volunteer> {
  return adminRequest<Volunteer>(`/api/admin/volunteers/${volunteerId}`, {
    method: 'PATCH',
    body: JSON.stringify(patch),
  })
}