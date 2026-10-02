let currentAdminId: string | null = null

export function setCurrentAdminId(id: string | null): void {
  currentAdminId = id
}

export function getCurrentAdminId(): string | null {
  return currentAdminId
}
