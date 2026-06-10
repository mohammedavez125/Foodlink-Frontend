import { useAuthStore } from "./authStore"

export function can(permission: string): boolean {
  const role = useAuthStore.getState().role
  return role?.permissions?.includes(permission) ?? false
}
