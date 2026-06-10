/* eslint-disable react-refresh/only-export-components */
import { createFileRoute } from "@tanstack/react-router"
import { requireRole } from "@/auth/roles"
import { DonorLayout } from "@/components/layout"
import { EditDonationPage } from "@/features/donation/pages/EditDonationPage"

function EditDonationRouteComponent() {
  const { donationId } = Route.useParams()

  return (
    <DonorLayout>
      <EditDonationPage donationId={donationId} />
    </DonorLayout>
  )
}

export const Route = createFileRoute("/(app)/donor/donations/$donationId/edit")({
  beforeLoad: () => requireRole(["DONOR"]),
  component: EditDonationRouteComponent,
})

