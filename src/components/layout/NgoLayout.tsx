import { useMemo, useState } from "react"
import { Link, useRouterState, useNavigate } from "@tanstack/react-router"
import { BarChart3, ClipboardList, Home, LogOut, Menu, PackageSearch, User, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { useAuthStore } from "@/auth/authStore"
import { cn } from "@/lib/utils"

interface DashboardLayoutProps {
  children: React.ReactNode
}

const ngoNavigation = [
  { label: "Dashboard", href: "/ngo/dashboard", icon: Home },
  { label: "Browse Donations", href: "/ngo/donations/browse", icon: PackageSearch },
  { label: "Accepted", href: "/ngo/donations/accepted", icon: ClipboardList },
  { label: "Profile", href: "/ngo/profile", icon: User },
]

function Breadcrumbs({ pathname }: { pathname: string }) {
  const parts = pathname.split("/").filter(Boolean)

  return (
    <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground">
      {parts.length ? (
        <ol className="flex flex-wrap items-center gap-1">
          <li>FoodLink</li>
          {parts.map((part) => (
            <li className="flex items-center gap-1" key={part}>
              <span>/</span>
              <span className="capitalize text-foreground">{part.replaceAll("-", " ")}</span>
            </li>
          ))}
        </ol>
      ) : null}
    </nav>
  )
}

function NgoSidebar({ pathname, onNavigate }: { pathname: string; onNavigate?: () => void }) {
  return (
    <aside className="flex h-full flex-col bg-sidebar text-sidebar-foreground">
      <div className="flex h-16 items-center gap-3 px-5">
        <div className="flex size-10 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-sm">
          <BarChart3 className="size-5" />
        </div>
        <div>
          <p className="font-heading text-lg font-semibold">FoodLink</p>
          <p className="text-xs text-muted-foreground">NGO workspace</p>
        </div>
      </div>
      <Separator />
      <nav className="flex-1 space-y-1 p-3">
        {ngoNavigation.map((item) => {
          const Icon = item.icon
          const active = pathname === item.href

          return (
            <Link
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                active && "bg-blue-100 text-blue-950",
              )}
              to={item.href}
              key={item.href}
              onClick={onNavigate}
            >
              <Icon className="size-4" />
              {item.label}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}

export function NgoLayout({ children }: DashboardLayoutProps) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const navigate = useNavigate()
  const pathname = useRouterState({ select: (state) => state.location.pathname })
  const user = useAuthStore((state) => state.user)
  const logout = useAuthStore((state) => state.logout)

  const initials = useMemo(() => {
    const source = user?.username ?? user?.email ?? "NGO"
    return source.slice(0, 2).toUpperCase()
  }, [user])

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(37,99,235,0.1),transparent_34%),linear-gradient(180deg,#fbfdfc,#f7f9fb)]">
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-72 lg:flex-col lg:border-r lg:bg-sidebar/95 lg:backdrop-blur">
        <NgoSidebar pathname={pathname} />
      </div>

      {mobileOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button className="absolute inset-0 bg-black/30" onClick={() => setMobileOpen(false)} type="button" />
          <div className="relative h-full w-80 max-w-[85vw] border-r bg-sidebar shadow-xl">
            <div className="absolute right-3 top-3">
              <Button aria-label="Close navigation" size="icon" variant="ghost" onClick={() => setMobileOpen(false)}>
                <X className="size-4" />
              </Button>
            </div>
            <NgoSidebar pathname={pathname} onNavigate={() => setMobileOpen(false)} />
          </div>
        </div>
      ) : null}

      <div className="lg:pl-72">
        <header className="sticky top-0 z-30 border-b bg-background/85 backdrop-blur-xl">
          <div className="flex h-16 items-center gap-4 px-4 sm:px-6 lg:px-8">
            <Button aria-label="Open navigation" className="lg:hidden" size="icon" variant="ghost" onClick={() => setMobileOpen(true)}>
              <Menu className="size-5" />
            </Button>
            <div className="flex-1">
              <Breadcrumbs pathname={pathname} />
            </div>
            <div className="flex items-center gap-3 rounded-full border bg-card py-1 pl-1 pr-3 shadow-sm">
              <div className="flex size-8 items-center justify-center rounded-full bg-blue-700 text-xs font-semibold text-white">
                {initials}
              </div>
              <div className="hidden leading-tight sm:block">
                <p className="text-sm font-medium">{user?.username ?? "NGO"}</p>
                <p className="text-xs text-muted-foreground">{user?.email ?? "Signed in"}</p>
              </div>
            </div>
            <Button
              size="icon"
              variant="ghost"
              aria-label="Logout"
              onClick={() => {
                logout()
                navigate({ to: "/login" })
              }}
            >
              <LogOut className="size-4" />
            </Button>
          </div>
        </header>
        <main className="px-4 py-6 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  )
}
