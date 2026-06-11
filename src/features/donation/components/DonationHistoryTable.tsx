import { useMemo, useState } from "react"
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type Column,
  type SortingState,
} from "@tanstack/react-table"
import { ArrowUpDown, Eye } from "lucide-react"
import { Link } from "@tanstack/react-router"
import { Button } from "@/components/ui/button"
import { buttonVariants } from "@/components/ui/button-variants"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { StatusBadge } from "@/components/common"
import type { DonationResponse } from "@/services/openapi/generated"
import { cn } from "@/lib/utils"
import { formatDateTime, readOptionalString } from "@/utils"

interface DonationHistoryTableProps {
  donations: DonationResponse[]
  counterpartyLabel: string
  getCounterparty: (donation: DonationResponse) => string
}

function sortableHeader(label: string, column: Column<DonationResponse, unknown>) {
  return (
    <Button className="-ml-2" size="sm" variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
      {label}
      <ArrowUpDown className="ml-1 size-3" />
    </Button>
  )
}

export function DonationHistoryTable({ donations, counterpartyLabel, getCounterparty }: DonationHistoryTableProps) {
  const [globalFilter, setGlobalFilter] = useState("")
  const [sorting, setSorting] = useState<SortingState>([{ id: "completedAt", desc: true }])

  const columns = useMemo<ColumnDef<DonationResponse>[]>(
    () => [
      {
        accessorKey: "foodName",
        header: ({ column }) => sortableHeader("Food Name", column),
        cell: ({ row }) => <span className="font-medium">{row.original.foodName ?? "Unnamed donation"}</span>,
      },
      {
        accessorKey: "category",
        header: ({ column }) => sortableHeader("Category", column),
        cell: ({ row }) => row.original.category?.replaceAll("_", " ") ?? "Not provided",
      },
      {
        accessorKey: "quantity",
        header: ({ column }) => sortableHeader("Quantity", column),
        cell: ({ row }) => row.original.quantity ?? "Not provided",
      },
      {
        id: "completedAt",
        accessorFn: (row) => readOptionalString(row, "completedAt") ?? "",
        header: ({ column }) => sortableHeader("Completed Date", column),
        cell: ({ row }) => formatDateTime(readOptionalString(row.original, "completedAt")),
      },
      {
        id: "counterparty",
        accessorFn: (row) => getCounterparty(row),
        header: counterpartyLabel,
        cell: ({ row }) => getCounterparty(row.original),
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => <StatusBadge status={row.original.status} />,
      },
      {
        id: "actions",
        header: "",
        cell: ({ row }) => (
          <Link
            className={cn(
              buttonVariants({ size: "icon-sm", variant: "ghost" }),
              !row.original.id && "pointer-events-none opacity-50",
            )}
            to="/donations/$id"
            params={{ id: row.original.id ?? "" }}
            aria-label="View donation details"
          >
            <Eye className="size-4" />
          </Link>
        ),
      },
    ],
    [counterpartyLabel, getCounterparty],
  )

  const table = useReactTable({
    data: donations,
    columns,
    state: {
      globalFilter,
      sorting,
    },
    onGlobalFilterChange: setGlobalFilter,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  })

  const visibleRows = table.getRowModel().rows

  return (
    <Card>
      <CardContent className="space-y-4 p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Input
            className="sm:max-w-sm"
            placeholder="Search history..."
            value={globalFilter}
            onChange={(event) => setGlobalFilter(event.target.value)}
          />
          <p className="text-sm text-muted-foreground">{table.getFilteredRowModel().rows.length} completed donations</p>
        </div>

        <div className="hidden overflow-hidden rounded-xl border md:block">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {visibleRows.length ? (
                visibleRows.map((row) => (
                  <TableRow key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell className="h-24 text-center text-muted-foreground" colSpan={columns.length}>
                    No completed donations found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        <div className="space-y-3 md:hidden">
          {visibleRows.length ? (
            visibleRows.map((row) => {
              const donation = row.original

              return (
                <div className="rounded-xl border p-4" key={row.id}>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-medium">{donation.foodName ?? "Unnamed donation"}</p>
                      <p className="text-sm text-muted-foreground">
                        {donation.category?.replaceAll("_", " ") ?? "Not provided"} · {donation.quantity ?? "?"} portions
                      </p>
                    </div>
                    <StatusBadge status={donation.status} />
                  </div>
                  <div className="mt-4 space-y-2 text-sm">
                    <div className="flex justify-between gap-3">
                      <span className="text-muted-foreground">Completed</span>
                      <span className="text-right">{formatDateTime(readOptionalString(donation, "completedAt"))}</span>
                    </div>
                    <div className="flex justify-between gap-3">
                      <span className="text-muted-foreground">{counterpartyLabel}</span>
                      <span className="text-right">{getCounterparty(donation)}</span>
                    </div>
                  </div>
                  {donation.id ? (
                    <Link className={cn(buttonVariants({ variant: "outline" }), "mt-4 w-full")} to="/donations/$id" params={{ id: donation.id }}>
                      View Details
                    </Link>
                  ) : null}
                </div>
              )
            })
          ) : (
            <div className="rounded-xl border py-10 text-center text-sm text-muted-foreground">
              No completed donations found.
            </div>
          )}
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-muted-foreground">
            Page {table.getState().pagination.pageIndex + 1} of {Math.max(table.getPageCount(), 1)}
          </p>
          <div className="flex items-center gap-2">
            <Button size="sm" variant="outline" disabled={!table.getCanPreviousPage()} onClick={() => table.previousPage()}>
              Previous
            </Button>
            <Button size="sm" variant="outline" disabled={!table.getCanNextPage()} onClick={() => table.nextPage()}>
              Next
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
