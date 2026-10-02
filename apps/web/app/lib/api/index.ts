export type { components, paths, operations } from './types'

import type { components } from './types'

export type Volunteer = components['schemas']['Volunteer']
export type Project = components['schemas']['Project']
export type Shift = components['schemas']['Shift']
export type Admin = components['schemas']['Admin']  
export type KioskAuthRequest = components['schemas']['KioskAuthRequest']
export type KioskAuthResponse = components['schemas']['KioskAuthResponse']
export type CheckInRequest = components['schemas']['CheckInRequest']
export type CheckOutRequest = components['schemas']['CheckOutRequest']
export type ErrorResponse = components['schemas']['ErrorResponse']
