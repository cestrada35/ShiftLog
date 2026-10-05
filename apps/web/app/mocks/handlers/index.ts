import { kioskHandlers } from './kiosk'
import { adminHandlers } from './admin'
import { adminDevHandlers } from './adminDev'
import { adminVolunteerHandlers } from './adminVolunteers'

export const handlers = [
  ...kioskHandlers,
  ...adminHandlers,
  ...adminDevHandlers,
  ...adminVolunteerHandlers,
]