import { createFileRoute } from "@tanstack/react-router"
import { requireRole } from "@/auth/roles"
import { DonorLayout } from "@/components/layout"
import { DonorDonationsPage } from "@/features/donation/pages/DonorDonationsPage"

export const Route = createFileRoute("/(app)/donor/donations/")({
  beforeLoad: () => requireRole(["DONOR"]),
  component: () => (
    <DonorLayout>
      <DonorDonationsPage />
    </DonorLayout>
  ),
})
