import { PlusCircle } from "lucide-react"
import { buttonVariants } from "@/components/ui/button-variants"
import { EmptyState, ErrorState, PageHeader } from "@/components/common"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"
import { DonorDonationsTable } from "../components/DonorDonationsTable"
import { useDeleteDonation, useMyDonations } from "../hooks/useDonations"

export function DonorDonationsPage() {
  const donationsQuery = useMyDonations()
  const deleteDonation = useDeleteDonation()
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
        <DonorDonationsTable donations={donations} isDeleting={deleteDonation.isPending} onDelete={(donationId) => deleteDonation.mutate(donationId)} />
      ) : null}
    </div>
  )
}

