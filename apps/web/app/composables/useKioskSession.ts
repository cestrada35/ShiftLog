import { ref } from 'vue'
import type { Volunteer, Shift, ErrorResponse } from '~/lib/api'
import { ApiError, authenticateByPin } from '~/lib/api/kiosk'



export function useKioskSession() {
    const state = ref<'idle' | 'identified' | 'error'>('idle')
    const volunteer = ref<Volunteer | null>(null)
    const activeShift = ref<Shift | null>(null)
    const error = ref<string | null>(null)
    // const error = ref({})

    async function identify(pin: string) {
        try {
            const res = await authenticateByPin(pin)
            volunteer.value = res.volunteer
            activeShift.value = res.activeShift
            state.value = 'identified'
        } catch (err) {
            // error.value = err as ErrorResponse
            error.value = err instanceof ApiError ? err.message : 'Something went wrong'
            state.value = 'error'
        }
        
    }

    function reset() {
        volunteer.value = null
        activeShift.value = null
        state.value = 'idle'
        error.value = null
    }

    return { state, volunteer, activeShift, error, identify, reset }
}


