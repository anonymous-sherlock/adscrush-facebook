"use client";

import { ColumnDef } from "@tanstack/react-table";

import { Checkbox } from "@/ui/checkbox";

import { Payment, Payment_Status, UserPaymentMethod } from "@prisma/client";
import { DataTableColumnHeader } from "./data-table-column-header";
import { DataTableRowActions } from "./data-table-row-actions";
import { formatDate, formatPrice } from "@/lib/utils";
import { PAYMENT_STATUS } from "@/constants/index";
import { cn } from "@/lib/utils";
import { CustomBadge } from "@/components/CustomBadge";
import { RouterOutputs } from "@/server";
export type PaymentsList = Pick<
  Payment,
  "id" | "txid" | "status" | "amount" | "createdAt" | "type"
> & {
  userPayoutMethod: RouterOutputs["payment"]["getAll"][number]["userPayoutMethod"]
}


export const columns: ColumnDef<PaymentsList>[] = [
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
      <DataTableColumnHeader column={column} title="Id" />
    ),
    cell: ({ row }) => (
      <div className="w-[75px] truncate">{row.original.id}</div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "txid",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Transaction Id" />
    ),
    cell: ({ row }) => (
      <div className="truncate">
        {row.original.txid}
      </div>
    ),
    enableSorting: false,
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
    accessorKey: "userPayoutMethod",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Payout To" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2 max-w-[220px] truncate">
          <span className="w-full truncate font-medium ">
            {
              row.original?.userPayoutMethod?.details && (typeof row.original.userPayoutMethod.details === 'object') && ('upiId' in row.original.userPayoutMethod.details && typeof row.original.userPayoutMethod.details.upiId == "string") ? (
                row.original.userPayoutMethod.details.upiId
              ) : "Payment method Deleted."
            }
          </span>
        </div>
      );
    },
    enableSorting: false,
  },
  {
    accessorKey: "type",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Type" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2 max-w-[220px] ">
          <span className="w-full truncate font-medium ">
            {

              row.original.type}
          </span>
        </div>
      );
    },
    enableSorting: false,
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Payment Status" />
    ),
    cell: ({ row }) => {

      return <CustomBadge badgeValue={row.original.status} status={PAYMENT_STATUS} />
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
    enableSorting: false,

  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Payment made on" />
    ),
    cell: ({ row }) => (
      <div className="truncate">
        {formatDate(row.original.createdAt,)}
      </div>
    ),
    enableSorting: false,
  },
  {
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
];