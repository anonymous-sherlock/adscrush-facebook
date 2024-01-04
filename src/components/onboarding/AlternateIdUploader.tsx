import { DOCUMENT_OPTIONS } from '@/constants/index'
import { cn } from '@/lib/utils'
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover'
import { CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem } from 'cmdk'
import { ChevronsUpDown, Command, Check } from 'lucide-react'
import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '../ui/form'
import { useFormContext } from 'react-hook-form'
import { FBOnboardingSchema } from '@/schema/onboarding.schema'
import { z } from 'zod'

export function AlternateIdUploader() {
  const [open, setOpen] = useState(false);

  const { control, setValue, watch, } = useFormContext<z.infer<typeof FBOnboardingSchema>>();

  return (
    <FormField
      control={control}
      name="alternativeID"
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-card-foreground">Alternate ID</FormLabel>
          <FormControl>
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button variant="outline" role="combobox" aria-expanded={open} className={cn("w-full justify-between h-11", !field.value && "text-muted-foreground")}>
                    {field.value ? field.value : "Select a Alternate ID"}
                    <ChevronsUpDown className="h-3 w-3 shrink-0 opacity-50" />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className="w-[300px] p-0">
                <Command className="m-0 h-full w-full p-0">
                  <CommandInput placeholder="Search..." />
                  <CommandList>
                    <CommandEmpty>No Alternate ID Found.</CommandEmpty>
                    <CommandGroup heading="Alternate ID">
                      {DOCUMENT_OPTIONS.map((docName, index) => (
                        <CommandItem
                          key={index}
                          value={docName}
                          className="capitalize my-2 cursor-pointer"
                          onSelect={() => {
                            setValue("alternativeID", docName)
                          }}
                        >
                          {docName}
                          <Check className={cn("ml-auto h-4 w-4", docName === field.value ? "opacity-100" : "opacity-0")} />
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

