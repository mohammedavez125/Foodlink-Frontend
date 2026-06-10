import { CheckCircle2, MapPin, Package, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { EmptyState, ErrorState, PageHeader } from "@/components/common"
import { useAvailableDonations, useAcceptDonation } from "@/features/donation"
import { format } from "date-fns"

export function NgoBrowseDonationsPage() {
  const donationsQuery = useAvailableDonations()
  const acceptMutation = useAcceptDonation()
  
  const donations = donationsQuery.data ?? []

  return (
    <div className="space-y-6">
      <PageHeader
        title="Browse Donations"
        description="View all available surplus food donations in your area and accept them for collection."
      />

      {donationsQuery.isLoading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton className="h-64 rounded-xl" key={i} />
          ))}
        </div>
      ) : null}

      {donationsQuery.isError ? (
        <ErrorState message={donationsQuery.error.message} onRetry={() => void donationsQuery.refetch()} />
      ) : null}

      {!donationsQuery.isLoading && !donationsQuery.isError ? (
        <>
          {donations.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {donations.map((donation) => (
                <Card className="flex flex-col overflow-hidden transition-all hover:shadow-md" key={donation.id}>
                  <CardHeader className="bg-muted/30 pb-4">
                    <div className="flex items-start justify-between gap-2">
                      <CardTitle className="line-clamp-1 text-lg">{donation.foodName}</CardTitle>
                      <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-blue-700">
                        <Package className="size-4" />
                      </div>
                    </div>
                    <div className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                      <span className="rounded-full bg-blue-50 px-2 py-0.5 text-blue-700 font-medium uppercase tracking-wider">
                        {donation.category?.replaceAll("_", " ")}
                      </span>
                      <span>•</span>
                      <span>{donation.quantity} portions</span>
                    </div>
                  </CardHeader>
                  <CardContent className="flex-1 py-4 text-sm">
                    {donation.description && (
                      <p className="mb-4 line-clamp-2 text-muted-foreground">{donation.description}</p>
                    )}
                    <div className="space-y-2">
                      <div className="flex items-start gap-2">
                        <MapPin className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                        <span className="line-clamp-2">
                          {donation.pickupLocation?.addressLine}, {donation.pickupLocation?.city}
                        </span>
                      </div>
                      {donation.expiryTime && (
                        <div className="flex items-center gap-2">
                          <Calendar className="size-4 shrink-0 text-muted-foreground" />
                          <span>Expires {format(new Date(donation.expiryTime), "MMM d, h:mm a")}</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter className="border-t bg-muted/10 pt-4">
                    <Button 
                      className="w-full gap-2 bg-blue-700 hover:bg-blue-800"
                      disabled={acceptMutation.isPending}
                      onClick={() => donation.id && acceptMutation.mutate(donation.id)}
                    >
                      <CheckCircle2 className="size-4" />
                      {acceptMutation.isPending ? "Accepting..." : "Accept Donation"}
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <EmptyState
              title="No donations available"
              description="There are currently no active food donations waiting for collection. Check back soon!"
            />
          )}
        </>
      ) : null}
    </div>
  )
}
