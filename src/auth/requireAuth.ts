import { redirect } from "@tanstack/react-router"
import { useAuthStore } from "./authStore"

export function requireAuth() {
    // Check if store is hydrated from localStorage
    const state = useAuthStore.getState()
    let token = state.token

    if (!state._hasHydrated) {
        const stored = localStorage.getItem("foodlink-auth")
        if (stored) {
            try {
                const parsed = JSON.parse(stored)
                // Zustand persist stores state under a "state" key
                const persistedState = parsed.state
                token = persistedState?.token
                console.log("requireAuth: Fallback to localStorage token found:", !!token)
            } catch (e) {
                console.error("Failed to parse auth storage in requireAuth", e)
            }
        }
    }

    if (!token) {
        console.warn("requireAuth: No token found, redirecting to login. Current path:", window.location.pathname, "Storage key exists:", !!localStorage.getItem("foodlink-auth"))
        throw redirect({
            to: "/login",
        })
    }
}