import { kioskHandlers } from './kiosk'
import { adminHandlers } from './admin'
import { adminVolunteerHandlers } from './adminVolunteers'

export const handlers = [
  ...kioskHandlers,
  ...adminHandlers,
  ...adminVolunteerHandlers,
]