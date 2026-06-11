import type { DonationStatus } from "@/services/openapi/generated"
import { Badge } from "@/components/ui/badge"

const variants: Record<DonationStatus, React.ComponentProps<typeof Badge>["variant"]> = {
  AVAILABLE: "success",
  ACCEPTED: "info",
  DISPATCHED: "warning",
  RECEIVED: "success",
  COMPLETED: "default",
  EXPIRED: "outline",
  CANCELLED: "destructive",
}

export function StatusBadge({ status }: { status?: DonationStatus }) {
  if (!status) {
    return <Badge variant="outline">Unknown</Badge>
  }

  return <Badge variant={variants[status]}>{status.replaceAll("_", " ")}</Badge>
}
