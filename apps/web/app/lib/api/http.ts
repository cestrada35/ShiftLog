import type { ErrorResponse } from '~/lib/api'

export class ApiError extends Error {
  constructor(
    public code: string,
    message: string,
    public status: number,
  ) {
    super(message)
  }
}

export async function request<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers ?? {}),
    },
  })
  if (!res.ok) {
    const err = (await res.json()) as ErrorResponse
    throw new ApiError(err.code, err.message, res.status)
  }
  return res.json() as Promise<T>
}
