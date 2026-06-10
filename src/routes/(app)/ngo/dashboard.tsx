import { createFileRoute } from "@tanstack/react-router"
import { requireRole } from "@/auth/roles"
import { NgoLayout } from "@/components/layout/NgoLayout"
import { NgoDashboardPage } from "@/features/ngo/pages/NgoDashboardPage"

export const Route = createFileRoute("/(app)/ngo/dashboard")({
  beforeLoad: () => requireRole(["NGO"]),
  component: () => (
    <NgoLayout>
      <NgoDashboardPage />
    </NgoLayout>
  ),
})
