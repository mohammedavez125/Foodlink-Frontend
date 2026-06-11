import { ClipboardCheck, Clock, Inbox, MapPinned, PackageCheck, Search, Truck } from "lucide-react"
import { Link, useNavigate } from "@tanstack/react-router"
import { useAuthStore } from "@/auth/authStore"
import { Button } from "@/components/ui/button"
import { buttonVariants } from "@/components/ui/button-variants"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { EmptyState, ErrorState, PageHeader, StatCard, StatusBadge } from "@/components/common"
import { cn } from "@/lib/utils"
import { useAvailableDonations, useMyAcceptedDonations, useNgoHistory } from "@/features/donation"

export function NgoDashboardPage() {
  const availableDonationsQuery = useAvailableDonations()
  const acceptedDonationsQuery = useMyAcceptedDonations()
  const historyQuery = useNgoHistory()
  const availableDonations = availableDonationsQuery.data ?? []
  const acceptedDonations = acceptedDonationsQuery.data ?? []
  const history = historyQuery.data ?? []
  const acceptedCount = acceptedDonations.filter((donation) => donation.status === "ACCEPTED").length
  const dispatchedCount = acceptedDonations.filter((donation) => donation.status === "DISPATCHED").length
  const receivedCount = acceptedDonations.filter((donation) => donation.status === "RECEIVED").length
  const completedCount = history.length
  const recentDonations = acceptedDonations.slice(0, 5)
  const nearbyAvailableDonations = availableDonations.slice(0, 5)
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
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
            <StatCard title="Available" value={availableDonations.length} description="Open food donations nearby" icon={<ClipboardCheck className="size-5" />} />
            <StatCard title="Accepted" value={acceptedCount} description="Waiting for donor dispatch" icon={<Clock className="size-5" />} />
            <StatCard title="Dispatched" value={dispatchedCount} description="Ready to receive" icon={<Truck className="size-5" />} />
            <StatCard title="Received" value={receivedCount} description="Ready to complete" icon={<Inbox className="size-5" />} />
            <StatCard title="Total Food Donations Completed" value={historyQuery.isLoading ? "..." : completedCount} description="Completed donation history" icon={<PackageCheck className="size-5" />} />
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

            <Card>
              <CardHeader>
                <CardTitle>Nearby Available Donations</CardTitle>
              </CardHeader>
              <CardContent>
                {nearbyAvailableDonations.length ? (
                  <div className="space-y-3">
                    {nearbyAvailableDonations.map((donation) => (
                      <div className="flex flex-col gap-3 rounded-xl border p-3 sm:flex-row sm:items-center sm:justify-between" key={donation.id ?? donation.foodName}>
                        <div>
                          <p className="font-medium">{donation.foodName ?? "Unnamed donation"}</p>
                          <p className="text-sm text-muted-foreground">
                            {donation.pickupLocation?.city ?? "Location missing"} · {donation.quantity ?? "?"} portions
                          </p>
                        </div>
                        <MapPinned className="size-5 text-muted-foreground" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <EmptyState
                    title="No nearby donations"
                    description="There are no available donations to browse right now."
                    action={<Button onClick={() => navigate({ to: "/ngo/donations/browse" })}>Browse Donations</Button>}
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
