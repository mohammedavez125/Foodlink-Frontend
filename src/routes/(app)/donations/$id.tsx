/* eslint-disable react-refresh/only-export-components */
import { createFileRoute } from "@tanstack/react-router"
import { requireAuth } from "@/auth/requireAuth"
import { useAuthStore } from "@/auth/authStore"
import { getRoleName } from "@/auth/roles"
import { DonorLayout, NgoLayout } from "@/components/layout"
import { DonationDetailsPage } from "@/features/donation/pages/DonationDetailsPage"

function DonationDetailsRouteComponent() {
  const { id } = Route.useParams()
  const roleName = getRoleName()

  const Layout = roleName === "NGO" ? NgoLayout : DonorLayout

  return (
    <Layout>
      <DonationDetailsPage donationId={id} />
    </Layout>
  )
}

export const Route = createFileRoute("/(app)/donations/$id")({
  beforeLoad: requireAuth,
  component: DonationDetailsRouteComponent,
})

