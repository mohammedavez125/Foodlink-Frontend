import { createFileRoute } from "@tanstack/react-router"
import { requireRole } from "@/auth/roles"
import { NgoLayout } from "@/components/layout/NgoLayout"
import { NgoProfilePage } from "@/features/ngo/pages/NgoProfilePage"

export const Route = createFileRoute("/(app)/ngo/profile")({
  beforeLoad: () => requireRole(["NGO"]),
  component: () => (
    <NgoLayout>
      <NgoProfilePage />
    </NgoLayout>
  ),
})
