import { createFileRoute } from "@tanstack/react-router"
import { requireRole } from "@/auth/roles"
import { DonorLayout } from "@/components/layout"
import { DonorProfilePage } from "@/features/donor/pages/DonorProfilePage"

export const Route = createFileRoute("/(app)/donor/profile")({
  beforeLoad: () => requireRole(["DONOR"]),
  component: () => (
    <DonorLayout>
      <DonorProfilePage />
    </DonorLayout>
  ),
})
