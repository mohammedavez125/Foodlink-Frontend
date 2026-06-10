import { createFileRoute } from "@tanstack/react-router"
import { requireRole } from "@/auth/roles"
import { NgoLayout } from "@/components/layout/NgoLayout"
import { NgoAcceptedDonationsPage } from "@/features/ngo/pages/NgoAcceptedDonationsPage"

export const Route = createFileRoute("/(app)/ngo/donations/accepted")({
  beforeLoad: () => requireRole(["NGO"]),
  component: () => (
    <NgoLayout>
      <NgoAcceptedDonationsPage />
    </NgoLayout>
  ),
})
