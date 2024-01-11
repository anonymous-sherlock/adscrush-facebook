"use client"

import {
  CaretSortIcon,
  CheckIcon
} from "@radix-ui/react-icons"
import * as React from "react"

import { trpc } from "@/app/_trpc/client"
import { cn } from "@/lib/utils"
import { RouterOutputs } from "@/server"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/ui/avatar"
import { Button } from "@/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from "@/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/ui/popover"
import Link from "next/link"

type Account = RouterOutputs["onboarding"]["getOnboardingName"]["accounts"];

type PopoverTriggerProps = React.ComponentPropsWithoutRef<typeof PopoverTrigger>

interface TeamSwitcherProps extends PopoverTriggerProps {
  onboarding: RouterOutputs["onboarding"]["getOnboardingName"] 
}

export default function AccountSwitcher({ className, onboarding }: TeamSwitcherProps) {
  const { data: group } = trpc.onboarding.getOnboardingName.useQuery(undefined, {
    initialData: onboarding
  })
  const [open, setOpen] = React.useState(false)
  const [selectedTeam, setSelectedTeam] = React.useState<Account>(group.accounts)

  return (
    <>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            aria-label="Select a account"
            className={cn("w-[200px] justify-between", className)}
          >
            <Avatar className="mr-2 h-5 w-5">
              <AvatarImage
                src={`https://avatar.vercel.sh/${group.accounts.id}.png`}
                alt={selectedTeam.label}
                className=""
              />
              <AvatarFallback>{selectedTeam.label.slice(0, 1)}</AvatarFallback>
            </Avatar>
            {selectedTeam.label}
            <CaretSortIcon className="ml-auto h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <Command>
            <CommandList>
              <CommandInput placeholder="Search account..." />
              <CommandEmpty>No account found.</CommandEmpty>

              <CommandGroup key={group.label} heading={group.label}>

                <Link href={`/accounts/${group.accounts.id}`} key={group.accounts.id} >
                  <CommandItem
                    value={group.accounts.id}
                    onSelect={() => {
                      setSelectedTeam(group.accounts)
                      setOpen(false)
                    }}
                    className="text-sm"
                  >

                    <Avatar className="mr-2 h-5 w-5">
                      <AvatarImage
                        src={`https://avatar.vercel.sh/${group.accounts.id}.png`}
                        alt={group.accounts.label}
                        className=""
                      />
                      <AvatarFallback>{selectedTeam.label.slice(0, 1)}</AvatarFallback>
                    </Avatar>
                    {group.accounts.label}
                    <CheckIcon
                      className={cn(
                        "ml-auto h-4 w-4",
                        selectedTeam.id === group.accounts.id
                          ? "opacity-100"
                          : "opacity-0"
                      )}
                    />
                  </CommandItem>
                </Link>
              </CommandGroup>
            </CommandList>


            {/* <CommandSeparator />
            <CommandList>
              <CommandGroup>

                <CommandItem>
                  <Link href={ONBOARDING_REDIRECT} className="flex w-full ">
                    <PlusCircledIcon className="mr-2 h-5 w-5" />
                    Add Account
                  </Link>
                </CommandItem>

              </CommandGroup>
            </CommandList> */}

          </Command>
        </PopoverContent>
      </Popover>
    </>
  )
}
