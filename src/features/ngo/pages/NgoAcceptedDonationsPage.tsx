import { MapPin, Package, Calendar, Info } from "lucide-react"
import { useNavigate } from "@tanstack/react-router"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { EmptyState, ErrorState, PageHeader, StatusBadge } from "@/components/common"
import { useMyDonations } from "@/features/donation"
import { format } from "date-fns"

export function NgoAcceptedDonationsPage() {
  const navigate = useNavigate()
  const donationsQuery = useMyDonations()
  const donations = donationsQuery.data ?? []

  return (
    <div className="space-y-6">
      <PageHeader
        title="Accepted Donations"
        description="Manage the food donations you have accepted and track their collection status."
      />

      {donationsQuery.isLoading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
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
                      <StatusBadge status={donation.status} />
                    </div>
                    <div className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                      <span className="font-medium uppercase tracking-wider">
                        {donation.category?.replaceAll("_", " ")}
                      </span>
                      <span>•</span>
                      <span>{donation.quantity} portions</span>
                    </div>
                  </CardHeader>
                  <CardContent className="flex-1 py-4 text-sm">
                    <div className="space-y-3">
                      <div className="flex items-start gap-2">
                        <MapPin className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                        <div className="flex flex-col">
                          <span className="font-medium">Pickup Location</span>
                          <span className="line-clamp-2 text-muted-foreground">
                            {donation.pickupLocation?.addressLine}, {donation.pickupLocation?.city}
                          </span>
                        </div>
                      </div>
                      {donation.expiryTime && (
                        <div className="flex items-start gap-2">
                          <Calendar className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                          <div className="flex flex-col">
                            <span className="font-medium">Expiry</span>
                            <span className="text-muted-foreground">
                              {format(new Date(donation.expiryTime), "MMM d, h:mm a")}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter className="border-t bg-muted/10 pt-4">
                    <Button 
                      className="w-full gap-2"
                      variant="outline"
                      onClick={() => navigate({ to: "/donations/$id", params: { id: donation.id! } })}
                    >
                      <Info className="size-4" />
                      View Details
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <EmptyState
              title="No accepted donations"
              description="You haven't accepted any food donations yet. Head over to the browse page to find available food."
              action={<Button onClick={() => navigate({ to: "/ngo/donations/browse" })}>Browse Food</Button>}
            />
          )}
        </>
      ) : null}
    </div>
  )
}
