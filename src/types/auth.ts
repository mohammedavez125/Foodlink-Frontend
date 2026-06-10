import type { Role as ApiRole } from "@/services/openapi/generated"

export type Role = ApiRole & {
  permissions: string[]
}

export interface User {
  username: string
  email: string
  role: Role
}

export interface AuthResponse {
  token: string
  username: string
  email: string
  role: Role
}
