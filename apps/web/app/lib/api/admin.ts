import type { Admin } from '~/lib/api'
import { request, ApiError } from './http'
import { getCurrentAdminId } from './adminAuth'

export { ApiError } from './http'

export function whoami(): Promise<Admin> {
  const adminId = getCurrentAdminId()
  if (!adminId) {
    return Promise.reject(new ApiError('no_admin', 'No admin identity set', 401))
  }
  return request<Admin>('/api/admin/whoami', {
    headers: { 'X-Admin-Id': adminId },
  })
}