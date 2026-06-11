import { PlusCircle } from "lucide-react"
import { useState } from "react"
import { buttonVariants } from "@/components/ui/button-variants"
import { ConfirmActionDialog, EmptyState, ErrorState, PageHeader } from "@/components/common"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"
import type { DonationResponse } from "@/services/openapi/generated"
import { DonorDonationsTable } from "../components/DonorDonationsTable"
import { useDeleteDonation, useDispatchDonation, useMyDonations } from "../hooks/useDonations"

export function DonorDonationsPage() {
  const donationsQuery = useMyDonations()
  const deleteDonation = useDeleteDonation()
  const dispatchDonation = useDispatchDonation()
  const [dispatchTarget, setDispatchTarget] = useState<DonationResponse | null>(null)
  const donations = donationsQuery.data ?? []

  return (
    <div className="space-y-6">
      <PageHeader
        title="My Donations"
        description="Search, sort, update, and remove donations created by your donor profile."
        actions={
          <a className={cn(buttonVariants(), "bg-emerald-700 hover:bg-emerald-800")} href="/donor/donations/create">
            <PlusCircle className="size-4" />
            Create Donation
          </a>
        }
      />
      {donationsQuery.isLoading ? <Skeleton className="h-96" /> : null}
      {donationsQuery.isError ? <ErrorState message={donationsQuery.error.message} onRetry={() => void donationsQuery.refetch()} /> : null}
      {!donationsQuery.isLoading && !donationsQuery.isError && donations.length === 0 ? (
        <EmptyState title="No donations found" description="Create a donation to start matching with NGOs." />
      ) : null}
      {!donationsQuery.isLoading && !donationsQuery.isError && donations.length > 0 ? (
        <DonorDonationsTable
          donations={donations}
          isDeleting={deleteDonation.isPending}
          isDispatching={dispatchDonation.isPending}
          onDelete={(donationId) => deleteDonation.mutate(donationId)}
          onDispatch={setDispatchTarget}
        />
      ) : null}
      <ConfirmActionDialog
        open={Boolean(dispatchTarget)}
        title="Dispatch donation?"
        description="This moves the donation to in transit and allows the NGO to mark it received."
        confirmLabel="Dispatch"
        isPending={dispatchDonation.isPending}
        onOpenChange={(open) => {
          if (!open) setDispatchTarget(null)
        }}
        onConfirm={() => {
          if (!dispatchTarget?.id) return
          dispatchDonation.mutate(dispatchTarget.id, { onSuccess: () => setDispatchTarget(null) })
        }}
      />
    </div>
  )
}

