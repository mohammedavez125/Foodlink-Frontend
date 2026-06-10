import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"
import type { Role, User } from "@/types/auth"

interface AuthState {
  token: string | null
  user: User | null
  role: Role | null
  _hasHydrated: boolean
  setHasHydrated: (state: boolean) => void
  login: (token: string, user: User) => void
  logout: () => void
}

type PersistedAuthState = Pick<AuthState, "token" | "user" | "role">

const AUTH_STORAGE_KEY = "foodlink-auth"

function normalizeRoleName(value: unknown): string | null {
  if (typeof value !== "string") return null

  const roleName = value.trim().toUpperCase()
  return roleName.startsWith("ROLE_") ? roleName.slice(5) : roleName
}

function normalizeRole(role: unknown): Role | null {
  if (!role) return null

  if (typeof role === "string") {
    const roleName = normalizeRoleName(role)
    if (!roleName) return null

    return {
      roleName: roleName as Role["roleName"],
      name: roleName,
      permissions: [],
    }
  }

  if (typeof role !== "object") return null

  const candidate = role as Partial<Role>
  const authority = "authority" in candidate ? candidate.authority : undefined
  const roleName = normalizeRoleName(candidate.roleName ?? candidate.name ?? authority)
  if (!roleName) return null

  return {
    ...candidate,
    roleName: roleName as Role["roleName"],
    name: candidate.name ?? roleName,
    permissions: Array.isArray(candidate.permissions) ? candidate.permissions : [],
  } as Role
}

function normalizeUser(user: unknown, role: Role | null): User | null {
  if (!user || typeof user !== "object") return null

  const candidate = user as Partial<User>
  const userRole = normalizeRole(candidate.role) ?? role

  if (!candidate.username || !candidate.email || !userRole) return null

  return {
    username: candidate.username,
    email: candidate.email,
    role: userRole,
  }
}

export function getPersistedAuthState(): PersistedAuthState | null {
  try {
    const stored = localStorage.getItem(AUTH_STORAGE_KEY)
    if (!stored) return null

    const parsed = JSON.parse(stored) as { state?: Partial<PersistedAuthState> }
    const persistedState = parsed.state
    if (!persistedState?.token) return null

    const role = normalizeRole(persistedState.role ?? persistedState.user?.role)
    const user = normalizeUser(persistedState.user, role)

    return {
      token: persistedState.token,
      user,
      role,
    }
  } catch (e) {
    console.error("authStore: Failed to parse persisted auth state", e)
    return null
  }
}

export function getAuthSnapshot(): PersistedAuthState {
  const state = useAuthStore.getState()

  if (state.token && state.role) {
    return {
      token: state.token,
      user: state.user,
      role: state.role,
    }
  }

  const persistedState = getPersistedAuthState()
  if (persistedState?.token) {
    useAuthStore.setState({
      ...persistedState,
      _hasHydrated: true,
    })

    return persistedState
  }

  return {
    token: state.token,
    user: state.user,
    role: state.role,
  }
}

/**
 * Robust Auth Store using Zustand Persist
 * We use a dedicated storage key and ensure atomic updates.
 */
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      role: null,
      _hasHydrated: false,
      setHasHydrated: (state) => set({ _hasHydrated: state }),

      login: (token, user) => {
        if (!token) {
          throw new Error("Cannot persist auth state without a token")
        }

        const role = normalizeRole(user.role)
        if (!role) {
          throw new Error("Cannot persist auth state without a valid role")
        }

        const normalizedUser = normalizeUser(user, role) ?? user
        console.log("authStore: Login starting...", { 
            token,
            username: normalizedUser.username,
            role 
        })
        
        try {
          // Atomic storage update
          const stateToPersist = { token, user: normalizedUser, role }
          const storageValue = JSON.stringify({
            state: stateToPersist,
            version: 0
          })
          localStorage.setItem(AUTH_STORAGE_KEY, storageValue)
          console.log("authStore: localStorage updated manually", { 
              savedToken: token 
          })
        } catch (e) {
          console.error("authStore: Failed to write to localStorage", e)
        }

        set({
          token,
          user: normalizedUser,
          role,
        })
        console.log("authStore: Zustand state set", { 
            currentToken: useAuthStore.getState().token
        })
      },

      logout: () => {
        console.log("authStore: Logging out...")
        localStorage.removeItem(AUTH_STORAGE_KEY)
        set({
          token: null,
          user: null,
          role: null,
        })
      },
    }),
    {
      name: AUTH_STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => {
        console.log("authStore: Hydration starting...")
        return (rehydratedState, error) => {
          if (error) {
            console.error("authStore: Hydration failed", error)
          } else {
            console.log("authStore: Hydration finished", !!rehydratedState?.token)
            rehydratedState?.setHasHydrated(true)
          }
        }
      },
      partialize: (state) => ({
        token: state.token,
        user: state.user,
        role: state.role,
      }),
    }
  )
)
