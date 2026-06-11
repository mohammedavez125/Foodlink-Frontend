import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, type Resolver } from "react-hook-form"
import { useState } from "react"
import { z } from "zod"
import { Calendar, CheckCircle2, MapPin, Package } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { EmptyState, ErrorState, PageHeader, StatusBadge } from "@/components/common"
import { useAcceptDonation, useAvailableDonations } from "@/features/donation"
import type { AcceptDonationRequest, DonationResponse } from "@/services/openapi/generated"
import { format } from "date-fns"

const acceptDonationSchema = z.object({
  addressLine: z.string().min(1, "Address is required"),
  latitude: z.preprocess(
    (value) => (value === "" ? undefined : value),
    z.coerce.number("Latitude is required").min(-90, "Latitude must be at least -90").max(90, "Latitude must be at most 90"),
  ),
  longitude: z.preprocess(
    (value) => (value === "" ? undefined : value),
    z.coerce.number("Longitude is required").min(-180, "Longitude must be at least -180").max(180, "Longitude must be at most 180"),
  ),
})

type AcceptDonationFormValues = z.infer<typeof acceptDonationSchema>

const acceptDefaults: AcceptDonationFormValues = {
  addressLine: "",
  latitude: 0,
  longitude: 0,
}

function toAcceptDonationRequest(values: AcceptDonationFormValues): AcceptDonationRequest {
  return {
    dropLocation: {
      addressLine: values.addressLine,
      latitude: values.latitude,
      longitude: values.longitude,
    },
  }
}

interface AcceptDonationDialogProps {
  donation: DonationResponse | null
  isSubmitting: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (payload: AcceptDonationRequest) => void
}

function AcceptDonationDialog({ donation, isSubmitting, onOpenChange, onSubmit }: AcceptDonationDialogProps) {
  const form = useForm<AcceptDonationFormValues>({
    resolver: zodResolver(acceptDonationSchema) as Resolver<AcceptDonationFormValues>,
    defaultValues: acceptDefaults,
    values: acceptDefaults,
  })

  return (
    <Dialog open={Boolean(donation)} onOpenChange={onOpenChange}>
      <DialogContent onClose={() => onOpenChange(false)}>
        <form
          className="space-y-6"
          onSubmit={form.handleSubmit((values) => onSubmit(toAcceptDonationRequest(values)))}
        >
          <DialogHeader>
            <DialogTitle>Accept donation</DialogTitle>
            <DialogDescription>
              Provide the NGO drop location before accepting {donation?.foodName ?? "this donation"}.
            </DialogDescription>
          </DialogHeader>

          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="drop-address">Address</FieldLabel>
              <Input id="drop-address" placeholder="NGO warehouse or distribution point" {...form.register("addressLine")} />
              <FieldError errors={[form.formState.errors.addressLine]} />
            </Field>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field>
                <FieldLabel htmlFor="drop-latitude">Latitude</FieldLabel>
                <Input id="drop-latitude" step="any" type="number" {...form.register("latitude")} />
                <FieldError errors={[form.formState.errors.latitude]} />
              </Field>
              <Field>
                <FieldLabel htmlFor="drop-longitude">Longitude</FieldLabel>
                <Input id="drop-longitude" step="any" type="number" {...form.register("longitude")} />
                <FieldError errors={[form.formState.errors.longitude]} />
              </Field>
            </div>
          </FieldGroup>

          <DialogFooter>
            <Button disabled={isSubmitting} type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button className="bg-blue-700 hover:bg-blue-800" disabled={isSubmitting} type="submit">
              {isSubmitting ? "Accepting..." : "Accept Donation"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export function NgoBrowseDonationsPage() {
  const donationsQuery = useAvailableDonations()
  const acceptDonation = useAcceptDonation()
  const [acceptTarget, setAcceptTarget] = useState<DonationResponse | null>(null)
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
                      <span className="rounded-full bg-blue-50 px-2 py-0.5 font-medium uppercase tracking-wider text-blue-700">
                        {donation.category?.replaceAll("_", " ")}
                      </span>
                      <span>•</span>
                      <span>{donation.quantity} portions</span>
                    </div>
                  </CardHeader>
                  <CardContent className="flex-1 py-4 text-sm">
                    {donation.description ? (
                      <p className="mb-4 line-clamp-2 text-muted-foreground">{donation.description}</p>
                    ) : null}
                    <div className="space-y-2">
                      <div className="flex items-start gap-2">
                        <MapPin className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                        <span className="line-clamp-2">
                          {donation.pickupLocation?.addressLine}, {donation.pickupLocation?.city}
                        </span>
                      </div>
                      {donation.expiryTime ? (
                        <div className="flex items-center gap-2">
                          <Calendar className="size-4 shrink-0 text-muted-foreground" />
                          <span>Expires {format(new Date(donation.expiryTime), "MMM d, h:mm a")}</span>
                        </div>
                      ) : null}
                    </div>
                  </CardContent>
                  <CardFooter className="border-t bg-muted/10 pt-4">
                    {donation.status === "AVAILABLE" ? (
                      <Button
                        className="w-full gap-2 bg-blue-700 hover:bg-blue-800"
                        disabled={!donation.id || acceptDonation.isPending}
                        onClick={() => setAcceptTarget(donation)}
                      >
                        <CheckCircle2 className="size-4" />
                        Accept Donation
                      </Button>
                    ) : (
                      <div className="flex w-full items-center justify-between gap-3">
                        <span className="text-sm text-muted-foreground">Donation is no longer available</span>
                        <StatusBadge status={donation.status} />
                      </div>
                    )}
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

      <AcceptDonationDialog
        donation={acceptTarget}
        isSubmitting={acceptDonation.isPending}
        onOpenChange={(open) => {
          if (!open) setAcceptTarget(null)
        }}
        onSubmit={(payload) => {
          if (!acceptTarget?.id) return
          acceptDonation.mutate(
            { donationId: acceptTarget.id, payload },
            { onSuccess: () => setAcceptTarget(null) },
          )
        }}
      />
    </div>
  )
}
