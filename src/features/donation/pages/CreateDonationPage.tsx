import { Card, CardContent } from "@/components/ui/card"
import { ErrorState, PageHeader } from "@/components/common"
import { DonationForm, useCreateDonation } from "@/features/donation"

export function CreateDonationPage() {
  const createDonation = useCreateDonation()

  return (
    <div className="space-y-6">
      <PageHeader title="Create Donation" description="Publish surplus food with precise pickup and expiry details so NGOs can accept it quickly." />
      {createDonation.isError ? <ErrorState message={createDonation.error.message} /> : null}
      <Card>
        <CardContent className="p-4 md:p-6">
          <DonationForm
            submitLabel="Create Donation"
            submittingLabel="Creating..."
            isSubmitting={createDonation.isPending}
            onSubmit={(payload) => createDonation.mutate(payload, { onSuccess: () => window.location.assign("/donor/donations") })}
          />
        </CardContent>
      </Card>
    </div>
  )
}
