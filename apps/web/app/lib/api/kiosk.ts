import type { KioskAuthResponse, Project, Shift, CheckInRequest } from '~/lib/api'
import { request } from './http'

export { ApiError } from './http'

export function authenticateByPin(pin: string): Promise<KioskAuthResponse> {
  return request('/api/kiosk/auth', {
    method: 'POST',
    body: JSON.stringify({ pin }),
  })
}

export function fetchProjects(): Promise<Project[]> {
  return request('/api/kiosk/projects')
}

export function checkIn(body: CheckInRequest): Promise<Shift> {
  return request('/api/kiosk/check-in', {
    method: 'POST',
    body: JSON.stringify(body),
  })
}

export function checkOut(shiftId: string): Promise<Shift> {
  return request('/api/kiosk/check-out', {
    method: 'POST',
    body: JSON.stringify({ shiftId }),
  })
}