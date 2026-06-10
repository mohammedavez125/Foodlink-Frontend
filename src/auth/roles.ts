import { redirect } from "@tanstack/react-router"
import type { RoleName } from "@/services/openapi/generated"
import type { Role } from "@/types/auth"
import { getAuthSnapshot } from "./authStore"

function normalizeRoleName(value: unknown): string | null {
  if (typeof value !== "string") return null

  const roleName = value.trim().toUpperCase()
  return roleName.startsWith("ROLE_") ? roleName.slice(5) : roleName
}

export function getRoleNameFromValue(role: unknown): string | null {
  if (!role) return null
  if (typeof role === "string") return normalizeRoleName(role)
  if (typeof role !== "object") return null

  const candidate = role as Partial<Role>
  const authority = "authority" in candidate ? candidate.authority : undefined
  return normalizeRoleName(candidate.roleName ?? candidate.name ?? authority)
}

export function getRoleName(): string | null {
  return getRoleNameFromValue(getAuthSnapshot().role)
}

export function requireRole(roles: RoleName[]) {
  const auth = getAuthSnapshot()
  const roleName = getRoleNameFromValue(auth.role)

  if (!auth.token) {
    throw redirect({ to: "/login" })
  }

  if (!roleName || !roles.includes(roleName as RoleName)) {
    throw redirect({ to: "/home" })
  }
}
