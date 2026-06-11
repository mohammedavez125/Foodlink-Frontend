import { CheckCircle2, Clock, MapPin, Package, UserRound } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { ErrorState, PageHeader, StatusBadge } from "@/components/common"
import { Skeleton } from "@/components/ui/skeleton"
import type { DonationResponse, DonationStatus } from "@/services/openapi/generated"
import { formatDateTime, readOptionalString } from "@/utils"
import { useDonation } from "../hooks/useDonations"

const statusSteps = ["AVAILABLE", "ACCEPTED", "DISPATCHED", "RECEIVED", "COMPLETED"] as const

function DonationTimeline({ status }: { status?: DonationStatus }) {
  const currentStatus = status === "CANCELLED" || status === "EXPIRED" ? "AVAILABLE" : status ?? "AVAILABLE"
  const currentIndex = Math.max(statusSteps.indexOf(currentStatus as (typeof statusSteps)[number]), 0)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package className="size-5" />
          Donation Timeline
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ol className="space-y-4">
          {statusSteps.map((step, index) => {
            const reached = index <= currentIndex
            const current = index === currentIndex

            return (
              <li className="flex gap-3" key={step}>
                <div className={reached ? "text-emerald-600" : "text-muted-foreground"}>
                  {reached ? <CheckCircle2 className="size-5" /> : <Clock className="size-5" />}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-medium">{step.replaceAll("_", " ")}</p>
                    {current ? <Badge variant="info">Current</Badge> : null}
                  </div>
                  <p className="text-xs text-muted-foreground">{reached ? "Reached" : "Pending"}</p>
                  {index < statusSteps.length - 1 ? <Separator className="mt-3" /> : null}
                </div>
              </li>
            )
          })}
        </ol>
      </CardContent>
    </Card>
  )
}

function DropLocationCard({ donation }: { donation: DonationResponse }) {
  if (donation.status === "AVAILABLE" || !donation.dropLocation) {
    return null
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="size-5 text-emerald-700" />
          Drop Location
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 text-sm">
        <p className="font-medium">{donation.dropLocation.addressLine ?? "Address not provided"}</p>
        <p className="text-muted-foreground">Source: NGO</p>
        <div className="flex flex-wrap gap-2 pt-2">
          <Badge variant="outline">Lat {donation.dropLocation.latitude ?? "NA"}</Badge>
          <Badge variant="outline">Lng {donation.dropLocation.longitude ?? "NA"}</Badge>
        </div>
      </CardContent>
    </Card>
  )
}

interface DonationDetailsPageProps {
  donationId: string
}

export function DonationDetailsPage({ donationId }: DonationDetailsPageProps) {
  const donationQuery = useDonation(donationId)
  const donation = donationQuery.data

  return (
    <div className="space-y-6">
      <PageHeader title="Donation Details" description="Review donation information, pickup location, donor references, and current workflow state." />
      {donationQuery.isLoading ? <Skeleton className="h-96" /> : null}
      {donationQuery.isError ? <ErrorState message={donationQuery.error.message} onRetry={() => void donationQuery.refetch()} /> : null}
      {donation ? (
        <div className="grid gap-4 lg:grid-cols-[1fr_24rem]">
          <div className="space-y-4">
            <Card>
              <CardHeader className="flex-row items-start justify-between gap-4">
                <div>
                  <CardTitle>{donation.foodName ?? "Unnamed donation"}</CardTitle>
                  <p className="mt-1 text-sm text-muted-foreground">{donation.description ?? "No description provided."}</p>
                </div>
                <StatusBadge status={donation.status} />
              </CardHeader>
              <CardContent className="grid gap-3 sm:grid-cols-3">
                <div className="rounded-xl border p-3">
                  <p className="text-sm text-muted-foreground">Category</p>
                  <p className="mt-1 font-medium">{donation.category?.replaceAll("_", " ") ?? "Not provided"}</p>
                </div>
                <div className="rounded-xl border p-3">
                  <p className="text-sm text-muted-foreground">Quantity</p>
                  <p className="mt-1 font-medium">{donation.quantity ?? "Not provided"}</p>
                </div>
                <div className="rounded-xl border p-3">
                  <p className="text-sm text-muted-foreground">Expiry</p>
                  <p className="mt-1 font-medium">{formatDateTime(readOptionalString(donation, "expiryTime"))}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="size-5" />
                  Pickup Location
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <p className="font-medium">{donation.pickupLocation?.addressLine ?? "Address not provided"}</p>
                <p className="text-muted-foreground">Source: Donor</p>
                <p className="text-muted-foreground">
                  {[donation.pickupLocation?.city, donation.pickupLocation?.state, donation.pickupLocation?.pinCode].filter(Boolean).join(", ") || "Location details missing"}
                </p>
                <div className="flex flex-wrap gap-2 pt-2">
                  <Badge variant="outline">Lat {donation.pickupLocation?.latitude ?? "NA"}</Badge>
                  <Badge variant="outline">Lng {donation.pickupLocation?.longitude ?? "NA"}</Badge>
                </div>
              </CardContent>
            </Card>

            <DropLocationCard donation={donation} />
          </div>

          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserRound className="size-5" />
                  Donor Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div>
                  <p className="text-muted-foreground">Donor Profile ID</p>
                  <p className="font-medium">{donation.donorProfileId ?? "Not provided"}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Accepted NGO Profile ID</p>
                  <p className="font-medium">{donation.acceptedNgoProfileId ?? "Not accepted yet"}</p>
                </div>
              </CardContent>
            </Card>

            <DonationTimeline status={donation.status} />
          </div>
        </div>
      ) : null}
    </div>
  )
}
