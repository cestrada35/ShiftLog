import { describe, it, expect } from 'vitest'
import { useKioskSession } from '../../app/composables/useKioskSession'

describe('useKioskSession', () => {
    it('starts in idle state with no volunteer', () => {
        const session = useKioskSession()

        expect(session.state.value).toBe('idle')
        expect(session.volunteer.value).toBeNull()
        expect(session.activeShift.value).toBeNull()
        expect(session.error.value).toBeNull()
    })

    it('identifies a volunteer on a valid PIN', async () => {
        const session = useKioskSession()

        await session.identify('1234')

        expect(session.state.value).toBe('identified')
        expect(session.volunteer.value?.name).toBe('Mark S.')
        expect(session.activeShift.value).toBeNull()
        expect(session.error.value).toBeNull()
    })

    it('goes to error state on an invalid PIN', async () => {
        const session = useKioskSession()

        await session.identify('0000')

        expect(session.state.value).toBe('error')
        expect(session.volunteer.value).toBeNull()
        expect(session.error.value).toBe('PIN not recognized')
    })

    it('enters submitting state during check-in and returns active', async () => {
        const session = useKioskSession()

        await session.identify('1234')
        session.selectProject(session.projects.value[0].id)

        const promise = session.submitCheckIn()
        expect(session.state.value).toBe('submitting')

        await promise
        expect(session.state.value).toBe('active')
        expect(session.activeShift.value).not.toBeNull()
        })

    it('is a no-op if submitCheckIn is called without a selected project', async () => {
        const session = useKioskSession()
        await session.identify('1234')

        await session.submitCheckIn()

        expect(session.state.value).toBe('identified')
        expect(session.activeShift.value).toBeNull()
    })

    it('reset clears all state back to idle', async () => {
        const session = useKioskSession()
        await session.identify('1234')

        session.reset()

        expect(session.state.value).toBe('idle')
        expect(session.volunteer.value).toBeNull()
        expect(session.activeShift.value).toBeNull()
        expect(session.error.value).toBeNull()
    })
})