import { ClipboardCheck, Clock, PackageCheck, Search } from "lucide-react"
import { Link, useNavigate } from "@tanstack/react-router"
import { useState } from "react"
import { useAuthStore } from "@/auth/authStore"
import { Button } from "@/components/ui/button"
import { buttonVariants } from "@/components/ui/button-variants"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { EmptyState, ErrorState, PageHeader, StatCard, StatusBadge } from "@/components/common"
import { cn } from "@/lib/utils"
import { useAvailableDonations, useMyAcceptedDonations } from "@/features/donation"

const EXPIRING_SOON_WINDOW_MS = 6 * 60 * 60 * 1000

export function NgoDashboardPage() {
  const availableDonationsQuery = useAvailableDonations()
  const acceptedDonationsQuery = useMyAcceptedDonations()
  const [loadedAt] = useState(() => Date.now())
  const availableDonations = availableDonationsQuery.data ?? []
  const acceptedDonations = acceptedDonationsQuery.data ?? []
  const expiringDonations = availableDonations.filter((donation) => donation.expiryTime && new Date(donation.expiryTime).getTime() <= loadedAt + EXPIRING_SOON_WINDOW_MS)
  const recentDonations = acceptedDonations.slice(0, 5)
  const isLoading = availableDonationsQuery.isLoading || acceptedDonationsQuery.isLoading
  const errorQuery = availableDonationsQuery.isError ? availableDonationsQuery : acceptedDonationsQuery.isError ? acceptedDonationsQuery : null
  const user = useAuthStore((s) => s.user)
  const navigate = useNavigate()

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Welcome back, ${user?.username || "NGO"}`}
        description="Monitor your accepted donations, track deliveries, and find more surplus food to help those in need."
        actions={
          <Link className={cn(buttonVariants({ size: "lg" }), "bg-blue-700 hover:bg-blue-800")} to="/ngo/donations/browse">
            <Search className="size-4" />
            Browse Available
          </Link>
        }
      />

      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-3">
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
        </div>
      ) : null}

      {errorQuery ? <ErrorState message={errorQuery.error.message} onRetry={() => {
        void availableDonationsQuery.refetch()
        void acceptedDonationsQuery.refetch()
      }} /> : null}

      {!isLoading && !errorQuery ? (
        <>
          <div className="grid gap-4 md:grid-cols-3">
            <StatCard title="Available Donations" value={availableDonations.length} description="Food currently open for NGO collection" icon={<ClipboardCheck className="size-5" />} />
            <StatCard title="Accepted Donations" value={acceptedDonations.length} description="Collections assigned to your NGO" icon={<Clock className="size-5" />} />
            <StatCard title="Expiring Soon" value={expiringDonations.length} description="Available food expiring within 6 hours" icon={<PackageCheck className="size-5" />} />
          </div>

          <div className="grid gap-4 lg:grid-cols-[1fr_22rem]">
            <Card>
              <CardHeader>
                <CardTitle>Recent Accepted Donations</CardTitle>
              </CardHeader>
              <CardContent>
                {recentDonations.length ? (
                  <div className="space-y-3">
                    {recentDonations.map((donation) => (
                      <div className="flex flex-col gap-3 rounded-xl border p-3 sm:flex-row sm:items-center sm:justify-between" key={donation.id ?? donation.foodName}>
                        <div>
                          <p className="font-medium">{donation.foodName ?? "Unnamed donation"}</p>
                          <p className="text-sm text-muted-foreground">
                            {donation.category?.replaceAll("_", " ") ?? "Category missing"} · {donation.quantity ?? "?"} portions
                          </p>
                        </div>
                        <StatusBadge status={donation.status} />
                      </div>
                    ))}
                  </div>
                ) : (
                  <EmptyState
                    title="No accepted donations yet"
                    description="Browse available donations and accept them to start making an impact."
                    action={<Button onClick={() => navigate({ to: "/ngo/donations/browse" })}>Browse Food</Button>}
                  />
                )}
              </CardContent>
            </Card>

            <Card className="bg-blue-950 text-white">
              <CardHeader>
                <CardTitle>NGO Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link className="block rounded-xl bg-white/10 p-4 text-sm transition hover:bg-white/15" to="/ngo/donations/browse">
                  Find surplus food published by donors.
                </Link>
                <Link className="block rounded-xl bg-white/10 p-4 text-sm transition hover:bg-white/15" to="/ngo/donations/accepted">
                  Manage your active collections and logistics.
                </Link>
                <Link className="block rounded-xl bg-white/10 p-4 text-sm transition hover:bg-white/15" to="/ngo/profile">
                  Update your organization details and location.
                </Link>
              </CardContent>
            </Card>
          </div>
        </>
      ) : null}
    </div>
  )
}
