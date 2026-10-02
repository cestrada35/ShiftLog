import { describe, it, expect, beforeEach } from 'vitest'
import {
  listVolunteers,
  createVolunteer,
  updateVolunteer,
  ApiError,
} from '../../app/lib/api/admin'
import { setCurrentAdminId } from '../../app/lib/api/adminAuth'

const ADMIN_ID = 'aaaaaaaa-0000-4000-8000-000000000001'

describe('admin API client', () => {
  beforeEach(() => {
    setCurrentAdminId(ADMIN_ID)
  })

  it('listVolunteers returns the fixture list', async () => {
    const volunteers = await listVolunteers()
    expect(volunteers.map(v => v.name)).toEqual(['Mark S.', 'Alan Turing'])
    expect(volunteers.every(v => v.isActive)).toBe(true)
  })

  it('createVolunteer returns volunteer plus credentials', async () => {
    const result = await createVolunteer('Grace Hopper')

    expect(result.volunteer.name).toBe('Grace Hopper')
    expect(result.volunteer.isActive).toBe(true)
    expect(result.pin).toBe('482915')
    expect(result.password).toBe('demo-pass-xyz')
  })

  it('createVolunteer appends to the list', async () => {
    await createVolunteer('Grace Hopper')
    const volunteers = await listVolunteers()
    expect(volunteers.map(v => v.name)).toContain('Grace Hopper')
  })

  it('createVolunteer rejects empty names', async () => {
    await expect(createVolunteer('   ')).rejects.toMatchObject({
      code: 'empty_name',
      status: 400,
    })
  })

  it('updateVolunteer deactivates a volunteer', async () => {
    const [first] = await listVolunteers()
    const updated = await updateVolunteer(first.id, { isActive: false })
    expect(updated.isActive).toBe(false)

    const after = await listVolunteers()
    expect(after.find(v => v.id === first.id)?.isActive).toBe(false)
  })

  it('throws ApiError when no admin identity is set', async () => {
    setCurrentAdminId(null)
    await expect(listVolunteers()).rejects.toBeInstanceOf(ApiError)
  })
})