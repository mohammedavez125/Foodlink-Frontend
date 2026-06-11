import { createFileRoute } from "@tanstack/react-router"
import { requireRole } from "@/auth/roles"
import { NgoLayout } from "@/components/layout/NgoLayout"
import { NgoHistoryPage } from "@/features/donation/pages/NgoHistoryPage"

export const Route = createFileRoute("/(app)/ngo/history")({
  beforeLoad: () => requireRole(["NGO"]),
  component: () => (
    <NgoLayout>
      <NgoHistoryPage />
    </NgoLayout>
  ),
})
