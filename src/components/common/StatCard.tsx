import type { ReactNode } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface StatCardProps {
  title: string
  value: ReactNode
  description?: string
  icon?: ReactNode
  className?: string
}

export function StatCard({ title, value, description, icon, className }: StatCardProps) {
  return (
    <Card className={cn("border-0 bg-gradient-to-br from-card to-muted/40 shadow-sm ring-1 ring-border", className)}>
      <CardHeader className="flex-row items-center justify-between gap-3">
        <CardTitle className="text-sm text-muted-foreground">{title}</CardTitle>
        {icon ? <div className="rounded-lg bg-primary/10 p-2 text-primary">{icon}</div> : null}
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-semibold tracking-tight">{value}</div>
        {description ? <p className="mt-1 text-xs text-muted-foreground">{description}</p> : null}
      </CardContent>
    </Card>
  )
}
