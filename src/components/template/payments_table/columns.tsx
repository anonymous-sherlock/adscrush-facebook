"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/ui/checkbox";
import { CustomBadge } from "@/components/CustomBadge";
import { PAYMENT_STATUS } from "@/constants/index";
import { formatAccountNumber, formatPrice } from "@/lib/utils";
import { RouterOutputs } from "@/server";
import { Payment } from "@prisma/client";
import { format } from "date-fns";
import { DataTableColumnHeader } from "./data-table-column-header";
import { DataTableRowActions } from "./data-table-row-actions";
import { paymentMethodDetails } from "@/schema/payment.schema";
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
      <div className="w-[120px] truncate">
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
      const paymentMethod = paymentMethodDetails.safeParse(row.original.userPayoutMethod)
      if (!paymentMethod.success) {
        return "Payment method Deleted"
      }
      if ("upiId" in paymentMethod.data.details) {
        return (
          <div className="flex space-x-2 max-w-[220px] truncate">
            <span className="w-full truncate font-medium ">
              {paymentMethod.data.details.upiId}
            </span>
          </div>
        )
      } else {
        return (
          <div className="flex space-x-2 max-w-[220px] truncate">
            <span className="w-full truncate font-medium ">
              <div className="flex flex-col items-start">
                <span>{paymentMethod.data.details.accountHolderName}</span>
                <span className="text-default-500 text-tiny">{paymentMethod.data.details.bankName} - {formatAccountNumber(paymentMethod.data.details.accountNumber)}</span>
              </div>
            </span>
          </div>
        );
      }
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
            {row.original.type}
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
        {format(row.original.createdAt, "dd MMM, yyyy - hh:mmaaa")}
      </div>
    ),
    enableSorting: false,
  },
  {
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
];