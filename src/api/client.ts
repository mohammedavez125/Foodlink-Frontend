import axios from "axios"
import { toast } from "sonner"
import { getAuthSnapshot, useAuthStore } from "@/auth/authStore"

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080",
})

api.interceptors.request.use((config) => {
  console.log("Axios: Request starting...", { url: config.url })
  const { token } = getAuthSnapshot()

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
    console.log("Axios: Authorization header set", { 
      token,
      header: config.headers.Authorization
    })
  } else {
    console.warn("Axios: No token found for request", { url: config.url })
  }

  return config
})

api.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      console.warn("Axios: 401 Unauthorized detected", { 
        url: error.config?.url,
        headers: error.config?.headers,
        responseData: error.response?.data
      })
      // Only logout if we actually HAD a token but it's now invalid
      if (error.config?.headers?.Authorization) {
        console.warn("Axios: Token was present but rejected. Logging out...")
        useAuthStore.getState().logout()
        toast.error("Your session expired. Please sign in again.")
      } else {
        console.warn("Axios: 401 but no Authorization header was sent.")
      }
    }

    return Promise.reject(error)
  },
)
