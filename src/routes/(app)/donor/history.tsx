import { createFileRoute } from "@tanstack/react-router"
import { requireRole } from "@/auth/roles"
import { DonorLayout } from "@/components/layout"
import { DonorHistoryPage } from "@/features/donation/pages/DonorHistoryPage"

export const Route = createFileRoute("/(app)/donor/history")({
  beforeLoad: () => requireRole(["DONOR"]),
  component: () => (
    <DonorLayout>
      <DonorHistoryPage />
    </DonorLayout>
  ),
})
