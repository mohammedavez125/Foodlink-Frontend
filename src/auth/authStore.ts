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
        const role = user.role
        console.log("authStore: Login starting...", { 
            token,
            username: user.username, 
            role 
        })
        
        try {
          // Atomic storage update
          const stateToPersist = { token, user, role }
          const storageValue = JSON.stringify({
            state: stateToPersist,
            version: 0
          })
          localStorage.setItem("foodlink-auth", storageValue)
          console.log("authStore: localStorage updated manually", { 
              savedToken: token 
          })
        } catch (e) {
          console.error("authStore: Failed to write to localStorage", e)
        }

        set({
          token,
          user,
          role,
        })
        console.log("authStore: Zustand state set", { 
            currentToken: useAuthStore.getState().token
        })
      },

      logout: () => {
        console.log("authStore: Logging out...")
        localStorage.removeItem("foodlink-auth")
        set({
          token: null,
          user: null,
          role: null,
        })
      },
    }),
    {
      name: "foodlink-auth",
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: (state) => {
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
