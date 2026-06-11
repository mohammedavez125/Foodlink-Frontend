import { History } from "lucide-react"
import { Link } from "@tanstack/react-router"
import { EmptyState, ErrorState, PageHeader, StatCard } from "@/components/common"
import { Skeleton } from "@/components/ui/skeleton"
import { buttonVariants } from "@/components/ui/button-variants"
import { cn } from "@/lib/utils"
import { DonationHistoryTable } from "../components/DonationHistoryTable"
import { useNgoHistory } from "../hooks/useDonations"

export function NgoHistoryPage() {
  const historyQuery = useNgoHistory()
  const donations = historyQuery.data ?? []

  return (
    <div className="space-y-6">
      <PageHeader
        title="Donation History"
        description="Review completed donations handled by your NGO."
        actions={
          <Link className={cn(buttonVariants({ variant: "outline" }))} to="/ngo/donations/accepted">
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
            description="Completed donations visible to your NGO"
            icon={<History className="size-5" />}
          />
          {donations.length ? (
            <DonationHistoryTable
              donations={donations}
              counterpartyLabel="Donor"
              getCounterparty={(donation) => donation.donorProfileId ?? "Not provided"}
            />
          ) : (
            <EmptyState
              title="No completed donations yet"
              description="Completed donations will appear here after your NGO closes the workflow."
              action={
                <Link className={cn(buttonVariants())} to="/ngo/donations/accepted">
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
