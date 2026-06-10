import { createFileRoute } from "@tanstack/react-router"
import { requireRole } from "@/auth/roles"
import { NgoLayout } from "@/components/layout/NgoLayout"
import { NgoBrowseDonationsPage } from "@/features/ngo/pages/NgoBrowseDonationsPage"

export const Route = createFileRoute("/(app)/ngo/donations/browse")({
  beforeLoad: () => requireRole(["NGO"]),
  component: () => (
    <NgoLayout>
      <NgoBrowseDonationsPage />
    </NgoLayout>
  ),
})
