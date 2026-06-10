import { Link } from "@tanstack/react-router"
import { useAuthStore } from "@/auth/authStore"
import { getRoleNameFromValue } from "@/auth/roles"
import { LogoutButton } from "@/components/LogoutButton.tsx"
import { Button } from "@/components/ui/button"
import { Heart } from "lucide-react"

export function Navbar() {
  const user = useAuthStore((s) => s.user)
  const dashboardPath = getRoleNameFromValue(user?.role) === "NGO" ? "/ngo/dashboard" : "/donor/dashboard"

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-100 bg-white/80 backdrop-blur-md">
      <div className="container mx-auto flex h-20 items-center justify-between px-6">
        <Link to="/home" className="flex items-center gap-2 transition-opacity hover:opacity-90">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-600 text-white shadow-lg shadow-green-200">
            <Heart className="h-6 w-6 fill-current" />
          </div>
          <span className="text-2xl font-bold tracking-tight text-slate-900">
            Food<span className="text-green-600">Link</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          <Link
            to="/home"
            className="text-sm font-semibold text-slate-600 transition-colors hover:text-green-600"
          >
            Home
          </Link>
          <Link
            to="/home"
            className="text-sm font-semibold text-slate-600 transition-colors hover:text-green-600"
          >
            About Us
          </Link>
          <Link
            to="/home"
            className="text-sm font-semibold text-slate-600 transition-colors hover:text-green-600"
          >
            How it Works
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          {!user ? (
            <>
              <Link to="/login">
                <Button variant="ghost" className="font-bold text-slate-600 hover:text-green-600">
                  Login
                </Button>
              </Link>
              <Link to="/signup">
                <Button className="bg-green-600 font-bold text-white hover:bg-green-700 shadow-md shadow-green-100">
                  Sign Up
                </Button>
              </Link>
            </>
          ) : (
            <div className="flex items-center gap-4">
              <Link
                to={dashboardPath}
              >
                <Button
                  variant="outline"
                  className="border-green-600 font-bold text-green-600 hover:bg-green-50"
                >
                  Dashboard
                </Button>
              </Link>
              <LogoutButton />
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
