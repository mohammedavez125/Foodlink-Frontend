import { createFileRoute } from "@tanstack/react-router"
import { requireRole } from "@/auth/roles"
import { DonorLayout } from "@/components/layout"
import { DonorDashboardPage } from "@/features/donor/pages/DonorDashboardPage"

export const Route = createFileRoute("/(app)/donor/dashboard")({
  beforeLoad: () => requireRole(["DONOR"]),
  component: () => (
    <DonorLayout>
      <DonorDashboardPage />
    </DonorLayout>
  ),
})
