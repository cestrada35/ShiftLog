import type { KioskAuthResponse, ErrorResponse } from '~/lib/api'

export class ApiError extends Error {
  constructor(
    public code: string,
    message: string,
    public status: number,
  ) {
    super(message)
  }
}

export async function authenticateByPin(pin: string): Promise<KioskAuthResponse> {
  const res = await fetch('/api/kiosk/auth', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ pin }),
  })

  if (!res.ok) {
    const err = (await res.json()) as ErrorResponse
    throw new ApiError(err.code, err.message, res.status)
  }

  return res.json() as Promise<KioskAuthResponse>
}