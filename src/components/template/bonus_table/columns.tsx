"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/ui/checkbox";
import { formatPrice } from "@/lib/utils";
import { Bonus } from "@prisma/client";
import { DataTableColumnHeader } from "./data-table-column-header";
import { DataTableRowActions } from "./data-table-row-actions";
import { format } from "date-fns";
export type BonusList = Pick<
  Bonus,
  "id" | "amount" | "createdAt" | "type" | "updatedAt"
>


export const columns: ColumnDef<BonusList>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="translate-y-[2px]"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="translate-y-[2px]"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "id",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Bonus  Id" />
    ),
    cell: ({ row }) => (
      <div className="truncate">
        {row.original.id}
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "amount",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Amount" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2 max-w-[220px] ">
          <span className="w-full truncate font-medium ">
            {formatPrice(row.original.amount)}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "type",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Bonus Type" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2 max-w-[220px] ">
          <span className="w-full truncate font-medium ">
            {row.original.type}
          </span>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.original.type)
    },
    enableSorting: false,
  },
  {
    accessorKey: "updatedAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Bonus Updated at" />
    ),
    cell: ({ row }) => (
      <div className="truncate">
        {format(row.original.createdAt, "MMM dd, yyyy - hh:mmaaa")}
      </div>
    ),
    enableSorting: false,
  },
  {
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
];