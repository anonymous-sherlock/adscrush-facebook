"use client";

import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { Row } from "@tanstack/react-table";

import { Button } from "@/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/ui/dropdown-menu";
import { AlertDialog } from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { BonusListSchema } from "./schema";
interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
}

export function DataTableRowActions<TData>({
  row,
}: DataTableRowActionsProps<TData>) {
  const bonus = BonusListSchema.parse(row.original);


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
                navigator.clipboard.writeText(bonus.id.toString());
                toast.success('Successfully Copied bonus ID!')

              }}
            >Copy Bonus ID</DropdownMenuItem>

          </DropdownMenuContent>
        </DropdownMenu>
      </AlertDialog>
    </>
  );
}