import { kioskHandlers } from './kiosk'
import { adminHandlers } from './admin'

export const handlers = [...kioskHandlers, ...adminHandlers]
