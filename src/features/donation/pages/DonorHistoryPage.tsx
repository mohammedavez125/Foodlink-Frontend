import { History } from "lucide-react"
import { Link } from "@tanstack/react-router"
import { EmptyState, ErrorState, PageHeader, StatCard } from "@/components/common"
import { Skeleton } from "@/components/ui/skeleton"
import { buttonVariants } from "@/components/ui/button-variants"
import { cn } from "@/lib/utils"
import { DonationHistoryTable } from "../components/DonationHistoryTable"
import { useDonorHistory } from "../hooks/useDonations"

export function DonorHistoryPage() {
  const historyQuery = useDonorHistory()
  const donations = historyQuery.data ?? []

  return (
    <div className="space-y-6">
      <PageHeader
        title="Donation History"
        description="Review completed donations from your donor profile."
        actions={
          <Link className={cn(buttonVariants({ variant: "outline" }))} to="/donor/donations">
            View Donations
          </Link>
        }
      />

      {historyQuery.isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-28" />
          <Skeleton className="h-96" />
        </div>
      ) : null}

      {historyQuery.isError ? (
        <ErrorState message={historyQuery.error.message} onRetry={() => void historyQuery.refetch()} />
      ) : null}

      {!historyQuery.isLoading && !historyQuery.isError ? (
        <>
          <StatCard
            title="Total Food Donations Completed"
            value={donations.length}
            description="Completed donations visible to your account"
            icon={<History className="size-5" />}
          />
          {donations.length ? (
            <DonationHistoryTable
              donations={donations}
              counterpartyLabel="NGO Assigned"
              getCounterparty={(donation) => donation.acceptedNgoProfileId ?? "Not provided"}
            />
          ) : (
            <EmptyState
              title="No completed donations yet"
              description="Completed donations will appear here after NGOs finish the workflow."
              action={
                <Link className={cn(buttonVariants())} to="/donor/donations">
                  View Donations
                </Link>
              }
            />
          )}
        </>
      ) : null}
    </div>
  )
}
