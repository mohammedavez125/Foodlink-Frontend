export type FoodCategory =
  | "VEG"
  | "NON_VEG"
  | "MIXED"
  | "BAKERY"
  | "FRUITS"
  | "BEVERAGES"

export type DonationStatus =
  | "AVAILABLE"
  | "ACCEPTED"
  | "DISPATCHED"
  | "DELIVERED"
  | "COMPLETED"
  | "EXPIRED"
  | "CANCELLED"

export type DonorType =
  | "INDIVIDUAL"
  | "RESTAURANT"
  | "HOTEL"
  | "CATERING_SERVICE"
  | "VOLUNTEER_GROUP"

export type RoleName = "ADMIN" | "NGO" | "DONOR"

export interface Address {
  country?: string
  state?: string
  city?: string
  street?: string
  pinCode?: number
}

export interface PickupLocation {
  addressLine?: string
  city?: string
  state?: string
  pinCode?: string
  latitude?: number
  longitude?: number
}

export interface DropLocation {
  addressLine?: string
  city?: string
  state?: string
  pinCode?: string
  latitude?: number
  longitude?: number
}

export interface CreateDonationRequest {
  foodName: string
  category: FoodCategory
  quantity: number
  description?: string
  pickupLocation: PickupLocation
  expiryTime?: string
}

export interface UpdateDonationRequest {
  foodName: string
  category: FoodCategory
  quantity?: number
  description?: string
  pickupLocation: PickupLocation
  expiryTime?: string
}

export interface DonationResponse {
  id?: string
  donorProfileId?: string
  acceptedNgoProfileId?: string
  foodName?: string
  category?: FoodCategory
  quantity?: number
  description?: string
  pickupLocation?: PickupLocation
  dropLocation?: DropLocation
  status?: DonationStatus
  estimatedMinutes?: number
}

export interface UpdateDonorProfileRequest {
  organizationName: string
  contactPerson: string
  phone: string
  address?: Address
  description?: string
  active?: boolean
}

export interface DonorProfileResponse {
  id?: string
  userId?: string
  donorType?: DonorType
  organizationName?: string
  contactPerson?: string
  phone?: string
  address?: Address
  description?: string
  active?: boolean
}

export interface UpdateNgoProfileRequest {
  ngoName: string
  registrationNumber: string
  contactPerson: string
  phone: string
  address?: Address
  description?: string
  active?: boolean
}

export interface NgoProfileResponse {
  id?: string
  userId?: string
  ngoName?: string
  registrationNumber?: string
  contactPerson?: string
  phone?: string
  address?: Address
  description?: string
  active?: boolean
}

export interface Role {
  roleName?: RoleName
  name?: RoleName | string
  permissions?: string[]
}

export interface AuthRequestDto {
  username?: string
  password?: string
}

export interface LoginResponseDto {
  token?: string
  username?: string
  email?: string
  role?: Role
}
