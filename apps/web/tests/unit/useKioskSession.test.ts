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

        const firstProject = session.projects.value[0]
        if (!firstProject) throw new Error('no project fixture')
        session.selectProject(firstProject.id)

        const promise = session.submitCheckIn()
        expect(session.submitting.value).toBe(true)
        expect(session.state.value).toBe('identified')   // ← state doesn't change

        await promise
        expect(session.state.value).toBe('active')
        expect(session.submitting.value).toBe(false)
    })

    it('completes a shift via submitCheckOut and lands in completed', async () => {
    const session = useKioskSession()
    await session.identify('1234')

    const firstProject = session.projects.value[0]
    if (!firstProject) throw new Error('no project fixture')
    session.selectProject(firstProject.id)
    await session.submitCheckIn()

    const promise = session.submitCheckOut()
    expect(session.submitting.value).toBe(true)
    expect(session.state.value).toBe('active')

    await promise
    expect(session.state.value).toBe('completed')
    expect(session.submitting.value).toBe(false)
    })

    it('is a no-op if submitCheckIn is called without a selected project', async () => {
        const session = useKioskSession()
        await session.identify('1234')

        session.selectProject('')

        await session.submitCheckIn()

        expect(session.state.value).toBe('identified')
        expect(session.activeShift.value).toBeNull()
    })

    it('is a no-op if submitCheckOut is called with no active shift', async () => {
        const session = useKioskSession()
        await session.identify('1234')

        await session.submitCheckOut()

        expect(session.state.value).toBe('identified')
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