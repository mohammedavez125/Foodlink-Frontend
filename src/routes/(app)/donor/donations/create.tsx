import { createFileRoute } from "@tanstack/react-router"
import { requireRole } from "@/auth/roles"
import { DonorLayout } from "@/components/layout"
import { CreateDonationPage } from "@/features/donation/pages/CreateDonationPage"

export const Route = createFileRoute("/(app)/donor/donations/create")({
  beforeLoad: () => requireRole(["DONOR"]),
  component: () => (
    <DonorLayout>
      <CreateDonationPage />
    </DonorLayout>
  ),
})
