"use client"

import * as React from "react"
import { CalendarIcon } from "@radix-ui/react-icons"
import { addDays, addHours, format, nextSaturday } from "date-fns"
import { DateRange } from "react-day-picker"

import { cn } from "@/lib/utils"
import { Button } from "@/ui/button"
import { Calendar } from "@/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/ui/popover"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { Clock } from "lucide-react"
import { Separator } from "@/components/ui/separator"

export function CalendarDateRangePicker({
  className,
}: React.HTMLAttributes<HTMLDivElement>) {
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: new Date(2023, 0, 20),
    to: addDays(new Date(2023, 0, 20), 20),
  })
  const today = new Date()

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-[260px] justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "LLL dd, y")} -{" "}
                  {format(date.to, "LLL dd, y")}
                </>
              ) : (
                format(date.from, "LLL dd, y")
              )
            ) : (
              <span>Pick a date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0 flex" align="end">
          <div className="flex flex-col gap-2 border-r px-2 py-4">
            <div className="px-4 text-sm font-medium">Snooze until</div>
            <div className="grid min-w-[250px] gap-1">
              <Button
                variant="ghost"
                className="justify-start font-normal"
              >
                Later today{" "}
                <span className="ml-auto text-muted-foreground">
                  {format(addHours(today, 4), "E, h:m b")}
                </span>
              </Button>
              <Button
                variant="ghost"
                className="justify-start font-normal"
              >
                Tomorrow
                <span className="ml-auto text-muted-foreground">
                  {format(addDays(today, 1), "E, h:m b")}
                </span>
              </Button>
              <Button
                variant="ghost"
                className="justify-start font-normal"
              >
                This weekend
                <span className="ml-auto text-muted-foreground">
                  {format(nextSaturday(today), "E, h:m b")}
                </span>
              </Button>
              <Button
                variant="ghost"
                className="justify-start font-normal"
              >
                Next week
                <span className="ml-auto text-muted-foreground">
                  {format(addDays(today, 7), "E, h:m b")}
                </span>
              </Button>
            </div>
          </div>
          <div className="p-2">
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={date?.from}
              selected={date}
              onSelect={setDate}
              numberOfMonths={2}
            />
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}
