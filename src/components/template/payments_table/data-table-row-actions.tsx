"use client";
import { AlertDialog } from "@/components/ui/alert-dialog";
import Spinner from "@/components/ui/spinner";
import { PAYMENT_STATUS } from "@/constants/index";
import { changePaymentStatus } from "@/lib/actions/payment";
import { Button } from "@/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger
} from "@/ui/dropdown-menu";
import { Payment_Status as paymentStatus } from "@prisma/client";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { Row } from "@tanstack/react-table";
import { useSession } from "next-auth/react";
import React, { useState } from "react";
import { toast } from "sonner";
import { PaymentListSchema } from "./schema";
import { useRouter } from "next/navigation";
import { catchError } from "@/lib/utils";

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
}

export function DataTableRowActions<TData>({
  row,
}: DataTableRowActionsProps<TData>) {
  const payment = PaymentListSchema.parse(row.original);
  const [paymentStatus, setPaymentStatus] = useState<paymentStatus>(payment.status);
  const { data: session, status } = useSession()
  const [isPending, startTransition] = React.useTransition()
  const router = useRouter()



  function handleStatusChange(status: paymentStatus) {
    startTransition(async () => {
      try {
        // const data = await changePaymentStatus({ id: payment.id, status });
        // setPaymentStatus(data.status);
        router.refresh();
      } catch (error) {
        catchError(error)
      }
    });
  }


  if (isPending) {
    return (
      <div className="flex items-center justify-center">
        <Spinner />
      </div>
    )

  }
  return (
    <>
      <AlertDialog>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
            >
              <DotsHorizontalIcon className="h-4 w-4" />
              <span className="sr-only">Open menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[160px]">
            <DropdownMenuItem className="cursor-pointer"
              onClick={() => {
                navigator.clipboard.writeText(payment.txid.toString());
                toast.success('Successfully Copied User ID!')

              }}
            >Copy Transaction ID</DropdownMenuItem>

            {
              session?.user.role === "ADMIN" ?
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>Status</DropdownMenuSubTrigger>
                  <DropdownMenuSubContent>
                    <DropdownMenuRadioGroup
                      value={paymentStatus}
                      onValueChange={(e) => handleStatusChange(e as paymentStatus)}
                    >
                      {PAYMENT_STATUS.map((status) => (
                        <DropdownMenuRadioItem
                          key={status.value}
                          value={status.value}
                          className=""
                        >
                          {status.icon && (
                            <status.icon className="mr-2 h-4 w-4 text-muted-foreground" />
                          )}
                          {status.label}
                        </DropdownMenuRadioItem>
                      ))}
                    </DropdownMenuRadioGroup>
                  </DropdownMenuSubContent>
                </DropdownMenuSub> : null
            }
          </DropdownMenuContent>
        </DropdownMenu>
      </AlertDialog>
    </>
  );
}