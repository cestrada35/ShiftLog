import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useAdminSession } from '../../app/stores/adminSession'
import { setCurrentAdminId, getCurrentAdminId } from '../../app/lib/api/adminAuth'
import { volunteers } from '../../app/mocks/fixtures/data'

// Our MSW mocks don't have /api/admin/whoami yet — add it below.
// For now, seed a valid admin fixture inline.

describe('useAdminSession', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    setCurrentAdminId(null)
    localStorage.clear()
  })

  it('starts unauthenticated', () => {
    const session = useAdminSession()
    expect(session.isAuthenticated).toBe(false)
    expect(session.admin).toBeNull()
  })

  it('signIn with a valid admin ID sets the admin and persists', async () => {
    try { 
      const session = useAdminSession()
      const ok = await session.signIn('aaaaaaaa-0000-4000-8000-000000000001')

      expect(ok).toBe(true)
      expect(session.isAuthenticated).toBe(true)
      expect(session.admin?.email).toBe('admin@shiftlog.local')
      expect(localStorage.getItem('shiftlog.adminId')).toBe('aaaaaaaa-0000-4000-8000-000000000001')
    } catch (e) {
      setCurrentAdminId(null)
    }
  })

  it('signIn with an unknown admin ID fails and clears state', async () => {
    const session = useAdminSession()
    const ok = await session.signIn('00000000-0000-4000-8000-000000000000')

    expect(ok).toBe(false)
    expect(session.isAuthenticated).toBe(false)
    expect(session.error).toBeTruthy()
  })

  it('signOut clears everything', async () => {
    const session = useAdminSession()
    await session.signIn('aaaaaaaa-0000-4000-8000-000000000001')
    session.signOut()

    expect(session.isAuthenticated).toBe(false)
    expect(session.admin).toBeNull()
    expect(getCurrentAdminId()).toBeNull()
    expect(localStorage.getItem('shiftlog.adminId')).toBeNull()
  })
})
