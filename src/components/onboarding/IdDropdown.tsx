
"use client";
import { Check, ChevronsUpDown } from "lucide-react";
import { Button } from "../ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "../ui/command";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

import { cn } from "@/lib/utils";
import { FBOnboardingSchema } from '@/schema/onboarding.schema';
import { useFormContext } from "react-hook-form";

import { z } from 'zod';
import { useState } from "react";
import { DOCUMENT_OPTIONS } from "@/constants/index";
import { AadharUploader } from "./AadharUploader";

function IdDropdown() {
  const [open, setOpen] = useState(false);

  const { control, setValue, watch, } = useFormContext<z.infer<typeof FBOnboardingSchema>>();

  return (
    <div className="flex flex-col gap-4">



    </div>

  )
}

export default IdDropdown