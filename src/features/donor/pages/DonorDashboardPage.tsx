import { ClipboardCheck, Clock, PackageCheck, PlusCircle } from "lucide-react"
import { Link, useNavigate } from "@tanstack/react-router"
import { useAuthStore } from "@/auth/authStore"
import { Button } from "@/components/ui/button"
import { buttonVariants } from "@/components/ui/button-variants"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { EmptyState, ErrorState, PageHeader, StatCard, StatusBadge } from "@/components/common"
import { cn } from "@/lib/utils"
import { useMyDonations } from "@/features/donation"

export function DonorDashboardPage() {
  const navigate = useNavigate()
  const donationsQuery = useMyDonations()
  const donations = donationsQuery.data ?? []
  const activeDonations = donations.filter((donation) => donation.status && !["COMPLETED", "CANCELLED", "EXPIRED"].includes(donation.status))
  const completedDonations = donations.filter((donation) => donation.status === "COMPLETED")
  const recentDonations = donations.slice(0, 5)
  const user = useAuthStore((s) => s.user)

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Welcome back, ${user?.username || "Donor"}`}
        description="Track donation volume, active pickups, and recently shared food from one operational view."
        actions={
          <Link className={cn(buttonVariants({ size: "lg" }), "bg-emerald-700 hover:bg-emerald-800")} to="/donor/donations/create">
            <PlusCircle className="size-4" />
            Create Donation
          </Link>
        }
      />

      {donationsQuery.isLoading ? (
        <div className="grid gap-4 md:grid-cols-3">
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
        </div>
      ) : null}

      {donationsQuery.isError ? <ErrorState message={donationsQuery.error.message} onRetry={() => void donationsQuery.refetch()} /> : null}

      {!donationsQuery.isLoading && !donationsQuery.isError ? (
        <>
          <div className="grid gap-4 md:grid-cols-3">
            <StatCard title="Total Donations" value={donations.length} description="All donations you have created" icon={<ClipboardCheck className="size-5" />} />
            <StatCard title="Active Donations" value={activeDonations.length} description="Available, accepted, or in transit" icon={<Clock className="size-5" />} />
            <StatCard title="Completed Donations" value={completedDonations.length} description="Successfully closed donations" icon={<PackageCheck className="size-5" />} />
          </div>

          <div className="grid gap-4 lg:grid-cols-[1fr_22rem]">
            <Card>
              <CardHeader>
                <CardTitle>Recent Donations</CardTitle>
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
                    title="No donations yet"
                    description="Create your first donation to make it visible to nearby NGOs."
                    action={<Button onClick={() => navigate({ to: "/donor/donations/create" })}>Create Donation</Button>}
                  />
                )}
              </CardContent>
            </Card>

            <Card className="bg-emerald-950 text-white">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link className="block rounded-xl bg-white/10 p-4 text-sm transition hover:bg-white/15" to="/donor/donations/create">
                  Add surplus food and publish it to NGOs.
                </Link>
                <Link className="block rounded-xl bg-white/10 p-4 text-sm transition hover:bg-white/15" to="/donor/donations">
                  Review active donations and update pickup details.
                </Link>
                <Link className="block rounded-xl bg-white/10 p-4 text-sm transition hover:bg-white/15" to="/donor/profile">
                  Keep organization and contact profile current.
                </Link>
              </CardContent>
            </Card>
          </div>
        </>
      ) : null}
    </div>
  )
}


