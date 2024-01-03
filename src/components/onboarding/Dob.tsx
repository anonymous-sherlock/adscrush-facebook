"use client";

import { CalendarIcon } from "@radix-ui/react-icons";
import { getYear, format, getDate } from "date-fns";
import { useFormContext } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { FBOnboardingSchema } from "@/schema/onboarding.schema";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import React, { useEffect, useState } from "react";
import { ScrollArea } from "../ui/scroll-area";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function DobPickerForm() {
  const today = new Date();

  const dateRef = React.useRef<Date>(today);
  const selectedYearRef = React.useRef<number>(getYear(today));
  const selectedMonthRef = React.useRef<number>(today.getMonth() + 1);

  const { setValue, control } = useFormContext<z.infer<typeof FBOnboardingSchema>>();

  function onSubmit(data: z.infer<typeof FBOnboardingSchema.shape.dob>) {
    toast(
      <>
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data)}</code>
        </pre>
      </>
    );
  }

  useEffect(() => {
    setValue("dob", dateRef.current ?? new Date());
    onSubmit(dateRef.current ?? new Date());
  }, [dateRef, setValue]);

  function onYearChange(value: string) {
    selectedYearRef.current = parseInt(value);

    // Set date to the beginning of the selected year
    // Set date to the beginning of the selected year
    const newDate = new Date(
      selectedYearRef.current,
      selectedMonthRef.current - 1,
      getDate(dateRef.current)
    );

    // Check if the selected month is in the future
    if (newDate > new Date()) {
      // Set the month to the current month
      selectedMonthRef.current = today.getMonth() + 1;
    }
    // Update date and trigger a re-render by updating the form field
    dateRef.current = new Date(
      selectedYearRef.current,
      selectedMonthRef.current - 1,
      getDate(dateRef.current)
    );
    setValue("dob", dateRef.current);
  }

  function onMonthChange(value: string) {
    selectedMonthRef.current = parseInt(value);

    // Set the month of the selected date
    dateRef.current = new Date(
      selectedYearRef.current,
      selectedMonthRef.current - 1,
      getDate(dateRef.current)
    );

    // Trigger a re-render by updating the form field
    setValue("dob", dateRef.current);
  }

  function nextMonth() {


    // Increment the month, update references, and trigger re-render
    const newMonth = selectedMonthRef.current + 1;
    selectedMonthRef.current = newMonth > 12 ? 1 : newMonth;
    selectedYearRef.current += newMonth > 12 ? 1 : 0;

    // Check if the selected year or month is in the future
    const currentDate = new Date();
    const selectedDate = new Date(selectedYearRef.current, selectedMonthRef.current - 1, getDate(dateRef.current));

    if (selectedDate > currentDate) {
      // Show a toast message if the selected year or month is in the future
      toast("Date of birth cannot be a future date.");

      // Revert the changes to avoid updating the date reference
      selectedMonthRef.current = newMonth > 12 ? 12 : newMonth;
      selectedYearRef.current -= newMonth > 12 ? 1 : 0;

      return;
    }

    updateDateRef();
  }

  function prevMonth() {
    // Decrement the month, update references, and trigger re-render
    const newMonth = selectedMonthRef.current - 1;
    selectedMonthRef.current = newMonth < 1 ? 12 : newMonth;
    selectedYearRef.current -= newMonth < 1 ? 1 : 0;

    updateDateRef();
  }
  function updateDateRef() {
    // Set the date based on the updated year and month
    dateRef.current = new Date(
      selectedYearRef.current,
      selectedMonthRef.current - 1,
      getDate(dateRef.current)
    );

    // Trigger a re-render by updating the form field
    setValue("dob", dateRef.current);
  }

  return (
    <>
      <FormField
        control={control}
        name="dob"
        render={({ field }) => (
          <FormItem className="flex flex-col justify-end">
            <FormLabel>Date of Birth</FormLabel>
            <Popover>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    variant={"outline"}
                    size="lg"
                    className={cn(
                      "w-full pl-3  text-left font-normal",
                      !field.value && "text-muted-foreground"
                    )}
                  >
                    {field.value ? (
                      format(field.value, "PPP")
                    ) : (
                      <span>Pick a date</span>
                    )}
                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <div className="flex">
                  {/* year */}
                  <Select
                    value={selectedYearRef.current?.toString()}
                    onValueChange={(value) => {
                      onYearChange(value);
                    }}
                  >
                    <SelectTrigger className="flex m-2 w-[-webkit-fill-available]">
                      <SelectValue placeholder="Year" />
                    </SelectTrigger>
                    <SelectContent position="popper">
                      <ScrollArea className="h-72">
                        {Array.from(
                          { length: new Date().getFullYear() - 1900 },
                          (_, index) => (
                            <SelectItem
                              key={index}
                              value={String(new Date().getFullYear() - index)}
                            >
                              {new Date().getFullYear() - index}
                            </SelectItem>
                          )
                        )}
                      </ScrollArea>
                    </SelectContent>
                  </Select>

                  {/* month */}
                  <Select
                    value={selectedMonthRef.current?.toString()}
                    onValueChange={(value) => {
                      onMonthChange(value);
                    }}
                  >
                    <SelectTrigger className="flex m-2 w-[-webkit-fill-available]">
                      <SelectValue placeholder="Month" />
                    </SelectTrigger>
                    <SelectContent
                      position="popper"
                      className="w-[260px]"
                      align="end"
                    >
                      <ScrollArea className="h-72">
                        {Array.from({ length: 12 }, (_, month) => {
                          const monthValue = month + 1;
                          const isFutureMonth = new Date(selectedYearRef.current, month, 1) > new Date();

                          return (
                            <SelectItem
                              key={monthValue}
                              value={String(monthValue)}
                              disabled={isFutureMonth} // Disable future months
                            >
                              {isFutureMonth ? (
                                <span className="text-gray-400">{new Date(0, month, 1).toLocaleString("default", { month: "long" })}</span>
                              ) : (
                                new Date(0, month, 1).toLocaleString("default", { month: "long" })
                              )}
                            </SelectItem>
                          );
                        })}
                      </ScrollArea>
                    </SelectContent>
                  </Select>
                </div>

                <Calendar
                  mode="single"
                  selected={dateRef.current}
                  onSelect={(newDate) => {
                    dateRef.current = newDate ?? new Date();
                    field.onChange(newDate);
                  }}
                  disabled={(date) =>
                    date > new Date() || date < new Date("1900-01-01")
                  }
                  month={new Date(selectedYearRef.current, selectedMonthRef.current - 1, 1)}
                  components={{
                    IconLeft: ({ ...props }) => <ChevronLeft className="p-1 w-full h-full" onClick={() => {
                      prevMonth()
                    }} />,
                    IconRight: ({ ...props }) =>
                      <ChevronRight className="p-1 w-full h-full" onClick={() => {
                        nextMonth()
                      }} />

                  }}
                />
              </PopoverContent>
            </Popover>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
}
