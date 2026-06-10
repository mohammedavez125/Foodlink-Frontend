import { useAuthStore } from "@/auth/authStore"
import { useNavigate } from "@tanstack/react-router"
import { Button } from "./ui/button"
import { LogOut } from "lucide-react"

export function LogoutButton() {
  const logout = useAuthStore((s) => s.logout)
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    void navigate({ to: "/login" })
  }

  if (!useAuthStore.getState().user) return null

  return (
    <Button
      variant="ghost"
      size="sm"
      className="gap-2 font-bold text-red-600 hover:bg-red-50 hover:text-red-700"
      onClick={handleLogout}
    >
      <LogOut className="h-4 w-4" />
      Logout
    </Button>
  )
}