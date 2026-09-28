import type { KioskAuthResponse, ErrorResponse, Project, Shift, CheckInRequest } from '~/lib/api'

export class ApiError extends Error {
  constructor(
    public code: string,
    message: string,
    public status: number,
  ) {
    super(message)
  }
}

async function request<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json' },
    ...init,
  })
  if (!res.ok) {
    const err = (await res.json()) as ErrorResponse
    throw new ApiError(err.code, err.message, res.status)
  }
  return res.json() as Promise<T>
}

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