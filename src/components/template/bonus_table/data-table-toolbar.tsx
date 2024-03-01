"use client";
import { CalendarDateRangePicker } from "@/components/global/date-range-picker";
import TooltipComponent from "@/components/tooltip-component";
import { BONUS_TYPE } from "@/constants/index";
import { cn } from "@/lib/utils";
import { Button } from "@/ui/button";
import { Input } from "@/ui/input";
import { Cross2Icon } from "@radix-ui/react-icons";
import { Table } from "@tanstack/react-table";
import { RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { DataTableFacetedFilter } from "./data-table-faceted-filter";
import { DataTableViewOptions } from "./data-table-view-options";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
}

export function DataTableToolbar<TData>({
  table,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;

  const [isRotating, setRotating] = useState(false);
  const router = useRouter()

  const handleRefreshClick = () => {
    setRotating(true);
    setTimeout(() => {
      setRotating(false);
      router.refresh()
    }, 1000);
  };

  return (
    <div className="flex flex-col md:flex-row gap-2 md:items-center justify-between">
      <div className="flex md:flex-row flex-wrap flex-1 md:items-center justify-start  md:space-x-2
      gap-2">
        <Input
          placeholder="Search Bonus..."
          value={table.getState().globalFilter}
          onChange={e => table.setGlobalFilter(String(e.target.value))}
          className="h-8 grow md:grow-0 w-[150px] lg:w-[250px]"
        />
        <TooltipComponent message="Refetch Data" delayDuration={250}>
          <Button variant="outline" size="sm" className="h-8 w-8 p-2 border-dashed m-0" onClick={handleRefreshClick} >
            <RefreshCw color="#000" className={cn("",
              isRotating ? 'animate-spin' : '',
            )} /></Button>
        </TooltipComponent>
        {table.getColumn("type") && (
          <DataTableFacetedFilter
            column={table.getColumn("type")}
            title="Bonus Type"
            options={BONUS_TYPE}
          />
        )}
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <Cross2Icon className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
      <CalendarDateRangePicker />
      <DataTableViewOptions table={table} />
    </div >
  );
}