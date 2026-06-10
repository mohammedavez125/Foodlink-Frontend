import { redirect } from "@tanstack/react-router"
import type { RoleName } from "@/services/openapi/generated"
import { useAuthStore } from "./authStore"

export function getRoleName(): string | null {
  const role = useAuthStore.getState().role
  return role?.roleName ?? role?.name ?? null
}

export function requireRole(roles: RoleName[]) {
  const token = useAuthStore.getState().token
  const roleName = getRoleName()

  if (!token) {
    throw redirect({ to: "/login" })
  }

  if (!roleName || !roles.includes(roleName as RoleName)) {
    throw redirect({ to: "/home" })
  }
}
