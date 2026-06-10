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
import { ArrowUpDown, Eye, Pencil, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { buttonVariants } from "@/components/ui/button-variants"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { StatusBadge } from "@/components/common"
import type { DonationResponse } from "@/services/openapi/generated"
import { cn } from "@/lib/utils"
import { formatDateTime, readOptionalString } from "@/utils"

interface DonorDonationsTableProps {
  donations: DonationResponse[]
  isDeleting: boolean
  onDelete: (donationId: string) => void
}

function sortableHeader(label: string, column: Column<DonationResponse, unknown>) {
  return (
    <Button className="-ml-2" size="sm" variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
      {label}
      <ArrowUpDown className="ml-1 size-3" />
    </Button>
  )
}

export function DonorDonationsTable({ donations, isDeleting, onDelete }: DonorDonationsTableProps) {
  const [globalFilter, setGlobalFilter] = useState("")
  const [sorting, setSorting] = useState<SortingState>([])

  const columns = useMemo<ColumnDef<DonationResponse>[]>(
    () => [
      {
        accessorKey: "foodName",
        header: ({ column }) => sortableHeader("Food", column),
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
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => <StatusBadge status={row.original.status} />,
      },
      {
        id: "createdAt",
        header: "Created",
        cell: ({ row }) => formatDateTime(readOptionalString(row.original, "createdAt")),
      },
      {
        id: "expiryTime",
        header: "Expiry",
        cell: ({ row }) => formatDateTime(readOptionalString(row.original, "expiryTime")),
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
          const donationId = row.original.id

          return (
            <div className="flex flex-wrap items-center gap-1">
              <a className={cn(buttonVariants({ size: "icon-sm", variant: "ghost" }), !donationId && "pointer-events-none opacity-50")} href={donationId ? `/donations/${donationId}` : "#"} aria-label="View donation"><Eye className="size-4" /></a>
              <a className={cn(buttonVariants({ size: "icon-sm", variant: "ghost" }), !donationId && "pointer-events-none opacity-50")} href={donationId ? `/donor/donations/${donationId}/edit` : "#"} aria-label="Edit donation"><Pencil className="size-4" /></a>
              <Button
                size="icon-sm"
                variant="destructive"
                disabled={!donationId || isDeleting}
                aria-label="Delete donation"
                onClick={() => {
                  if (donationId && window.confirm("Delete this donation?")) {
                    onDelete(donationId)
                  }
                }}
              >
                <Trash2 className="size-4" />
              </Button>
            </div>
          )
        },
      },
    ],
    [isDeleting, onDelete],
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

  return (
    <Card>
      <CardContent className="space-y-4 p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Input
            className="sm:max-w-sm"
            placeholder="Search donations..."
            value={globalFilter}
            onChange={(event) => setGlobalFilter(event.target.value)}
          />
          <p className="text-sm text-muted-foreground">{table.getFilteredRowModel().rows.length} donations</p>
        </div>
        <div className="overflow-hidden rounded-xl border">
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
              {table.getRowModel().rows.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell className="h-24 text-center text-muted-foreground" colSpan={columns.length}>
                    No donations found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
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




