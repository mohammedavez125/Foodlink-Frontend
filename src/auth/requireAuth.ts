import { redirect } from "@tanstack/react-router"
import { getAuthSnapshot } from "./authStore"

export function requireAuth() {
    const { token } = getAuthSnapshot()

    if (!token) {
        console.warn("requireAuth: No token found, redirecting to login. Current path:", window.location.pathname, "Storage key exists:", !!localStorage.getItem("foodlink-auth"))
        throw redirect({
            to: "/login",
        })
    }
}
