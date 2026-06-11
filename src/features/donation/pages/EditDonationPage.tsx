import { Card, CardContent } from "@/components/ui/card"
import { EmptyState, ErrorState, PageHeader } from "@/components/common"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { DonationForm, useDonation, useUpdateDonation } from "@/features/donation"
import type { DonationFormValues } from "../schemas/donationSchema"
import { readOptionalString } from "@/utils"

function toDatetimeLocal(value?: string): string {
  if (!value) {
    return ""
  }

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return ""
  }

  return date.toISOString().slice(0, 16)
}

interface EditDonationPageProps {
  donationId: string
}

export function EditDonationPage({ donationId }: EditDonationPageProps) {
  const donationQuery = useDonation(donationId)
  const updateDonation = useUpdateDonation()
  const donation = donationQuery.data

  const defaultValues: Partial<DonationFormValues> | undefined = donation
    ? {
        foodName: donation.foodName ?? "",
        category: donation.category ?? "VEG",
        quantity: donation.quantity ?? 1,
        description: donation.description ?? "",
        pickupAddress: donation.pickupLocation?.addressLine ?? "",
        city: donation.pickupLocation?.city ?? "",
        state: donation.pickupLocation?.state ?? "",
        pinCode: donation.pickupLocation?.pinCode ?? "",
        latitude: donation.pickupLocation?.latitude ?? 0,
        longitude: donation.pickupLocation?.longitude ?? 0,
        expiryTime: toDatetimeLocal(readOptionalString(donation, "expiryTime")),
      }
    : undefined

  return (
    <div className="space-y-6">
      <PageHeader title="Edit Donation" description="Update food, quantity, pickup, or expiry details before completion." />
      {donationQuery.isLoading ? <Skeleton className="h-96" /> : null}
      {donationQuery.isError ? <ErrorState message={donationQuery.error.message} onRetry={() => void donationQuery.refetch()} /> : null}
      {updateDonation.isError ? <ErrorState message={updateDonation.error.message} /> : null}
      {donation && donation.status !== "AVAILABLE" ? (
        <EmptyState
          title="Donation cannot be edited"
          description="Only available donations can be edited. Once accepted, the workflow is controlled by dispatch, receive, and complete actions."
          action={<Button onClick={() => window.location.assign("/donor/donations")}>Back to donations</Button>}
        />
      ) : null}
      {donation && donation.status === "AVAILABLE" && defaultValues ? (
        <Card>
          <CardContent className="p-4 md:p-6">
            <DonationForm
              defaultValues={defaultValues}
              submitLabel="Update Donation"
              submittingLabel="Updating..."
              isSubmitting={updateDonation.isPending}
              onSubmit={(payload) => updateDonation.mutate({ donationId, payload }, { onSuccess: () => window.location.assign("/donor/donations") })}
            />
          </CardContent>
        </Card>
      ) : null}
    </div>
  )
}
