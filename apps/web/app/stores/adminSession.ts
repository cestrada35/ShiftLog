import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Admin } from '~/lib/api'
import { whoami } from '~/lib/api/admin'
import { ApiError } from '~/lib/api/http'
import { setCurrentAdminId } from '~/lib/api/adminAuth'

const STORAGE_KEY = 'shiftlog.adminId'

export const useAdminSession = defineStore('adminSession', () => {
  const admin = ref<Admin | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  const isAuthenticated = computed(() => admin.value !== null)

  async function signIn(id: string): Promise<boolean> {
    loading.value = true
    error.value = null
    setCurrentAdminId(id)
    try {
      admin.value = await whoami()
      if (import.meta.client) localStorage.setItem(STORAGE_KEY, id)
      return true
    } catch (e) {
      setCurrentAdminId(null)
      admin.value = null
      if (import.meta.client) localStorage.removeItem(STORAGE_KEY)
      error.value = e instanceof ApiError ? e.message : 'Sign in failed'
      return false
    } finally {
      loading.value = false
    }
  }

  function signOut(): void {
    setCurrentAdminId(null)
    admin.value = null
    error.value = null
    if (import.meta.client) localStorage.removeItem(STORAGE_KEY)
  }

  async function loadFromStorage(): Promise<void> {
    if (!import.meta.client) return
    const stored = localStorage.getItem(STORAGE_KEY)
    if (!stored) return
    await signIn(stored)
  }

  return { admin, loading, error, isAuthenticated, signIn, signOut, loadFromStorage }
})
