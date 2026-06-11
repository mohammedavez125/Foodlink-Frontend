import { useState } from "react"
import { MapPin, Calendar, Info, PackageCheck, CheckCircle2 } from "lucide-react"
import { useNavigate } from "@tanstack/react-router"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { ConfirmActionDialog, EmptyState, ErrorState, PageHeader, StatusBadge } from "@/components/common"
import { useCompleteDonation, useMyAcceptedDonations, useReceiveDonation } from "@/features/donation"
import type { DonationResponse } from "@/services/openapi/generated"
import { format } from "date-fns"

export function NgoAcceptedDonationsPage() {
  const navigate = useNavigate()
  const donationsQuery = useMyAcceptedDonations()
  const receiveDonation = useReceiveDonation()
  const completeDonation = useCompleteDonation()
  const [receiveTarget, setReceiveTarget] = useState<DonationResponse | null>(null)
  const [completeTarget, setCompleteTarget] = useState<DonationResponse | null>(null)
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
                      {donation.dropLocation?.addressLine ? (
                        <div className="flex items-start gap-2">
                          <MapPin className="mt-0.5 size-4 shrink-0 text-emerald-600" />
                          <div className="flex flex-col">
                            <span className="font-medium">Drop Location</span>
                            <span className="line-clamp-2 text-muted-foreground">
                              {donation.dropLocation.addressLine}, {donation.dropLocation.city}
                            </span>
                          </div>
                        </div>
                      ) : null}
                    </div>
                  </CardContent>
                  <CardFooter className="grid gap-2 border-t bg-muted/10 pt-4 sm:grid-cols-2">
                    <Button 
                      className="gap-2"
                      variant="outline"
                      onClick={() => navigate({ to: "/donations/$id", params: { id: donation.id! } })}
                    >
                      <Info className="size-4" />
                      View Details
                    </Button>
                    {donation.status === "ACCEPTED" ? (
                      <div className="flex items-center rounded-lg border bg-muted/40 px-3 py-2 text-sm text-muted-foreground">
                        Waiting for donor to dispatch food
                      </div>
                    ) : null}
                    {donation.status === "DISPATCHED" ? (
                      <Button
                        className="gap-2 bg-emerald-700 hover:bg-emerald-800"
                        disabled={!donation.id || receiveDonation.isPending}
                        onClick={() => setReceiveTarget(donation)}
                      >
                        <PackageCheck className="size-4" />
                        Mark Received
                      </Button>
                    ) : null}
                    {donation.status === "RECEIVED" ? (
                      <Button
                        className="gap-2 bg-emerald-700 hover:bg-emerald-800"
                        disabled={!donation.id || completeDonation.isPending}
                        onClick={() => setCompleteTarget(donation)}
                      >
                        <CheckCircle2 className="size-4" />
                        Complete Donation
                      </Button>
                    ) : null}
                    {donation.status === "COMPLETED" ? (
                      <div className="flex items-center justify-center rounded-lg border bg-muted/40 px-3 py-2">
                        <StatusBadge status="COMPLETED" />
                      </div>
                    ) : null}
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
      <ConfirmActionDialog
        open={Boolean(receiveTarget)}
        title="Mark donation received?"
        description="This confirms that your NGO has received the dispatched food."
        confirmLabel="Mark Received"
        isPending={receiveDonation.isPending}
        onOpenChange={(open) => {
          if (!open) setReceiveTarget(null)
        }}
        onConfirm={() => {
          if (!receiveTarget?.id) return
          receiveDonation.mutate(receiveTarget.id, { onSuccess: () => setReceiveTarget(null) })
        }}
      />
      <ConfirmActionDialog
        open={Boolean(completeTarget)}
        title="Complete donation?"
        description="This closes the donation workflow after the food has been received."
        confirmLabel="Complete"
        isPending={completeDonation.isPending}
        onOpenChange={(open) => {
          if (!open) setCompleteTarget(null)
        }}
        onConfirm={() => {
          if (!completeTarget?.id) return
          completeDonation.mutate(completeTarget.id, { onSuccess: () => setCompleteTarget(null) })
        }}
      />
    </div>
  )
}
