import { ref } from 'vue'
import type { Volunteer, Shift, Project } from '~/lib/api'
import { authenticateByPin, fetchProjects, checkIn, checkOut, ApiError } from '~/lib/api/kiosk'

type KioskState = 'idle' | 'identified' | 'submitting' | 'active' | 'error'

export function useKioskSession() {
  const state = ref<KioskState>('idle')
  const volunteer = ref<Volunteer | null>(null)
  const activeShift = ref<Shift | null>(null)
  const completedShift = ref<Shift | null>(null)
  const projects = ref<Project[]>([])
  const selectedProjectId = ref<string | null>(null)
  const error = ref<string | null>(null)

  async function identify(pin: string) {
    try {
      const result = await authenticateByPin(pin)
      volunteer.value = result.volunteer
      activeShift.value = result.activeShift
      error.value = null

      if (result.activeShift) {
        state.value = 'active'
      } else {
        projects.value = await fetchProjects()
        state.value = 'identified'
      }
    } catch (err) {
      volunteer.value = null
      activeShift.value = null
      error.value = err instanceof ApiError ? err.message : 'Something went wrong'
      state.value = 'error'
    }
  }

  function selectProject(projectId: string) {
    selectedProjectId.value = projectId
  }

  async function submitCheckIn() {
    if (!volunteer.value || !selectedProjectId.value) return
    if (state.value === 'submitting') return   // guard against double-submit
    state.value = 'submitting'
    try {
        const shift = await checkIn({
        volunteerId: volunteer.value.id,
        projectId: selectedProjectId.value,
        })
        activeShift.value = shift
        state.value = 'active'
    } catch (err) {
        error.value = err instanceof ApiError ? err.message : 'Something went wrong'
        state.value = 'error'
    }
  }

  async function submitCheckOut() {
    if (!activeShift.value) return
    if (state.value === 'submitting') return
    const shift = activeShift.value
    state.value = 'submitting'
    try {
      const completed = await checkOut(shift.id)
      completedShift.value = completed
      activeShift.value = null
      state.value = 'completed'
    } catch (err) {
      error.value = err instanceof ApiError ? err.message : 'Something went wrong'
      state.value = 'error'
    }
  }

  function reset() {
    state.value = 'idle'
    volunteer.value = null
    activeShift.value = null
    completedShift.value = null
    projects.value = []
    selectedProjectId.value = null
    error.value = null
  }

  return {
    state,
    volunteer,
    activeShift,
    completedShift,
    projects,
    selectedProjectId,
    error,
    identify,
    selectProject,
    submitCheckIn,
    submitCheckOut,
    reset,
  }
}