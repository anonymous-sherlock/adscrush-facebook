import { env } from "@/env.mjs"
import type { Metadata } from "next"
import { redirect } from "next/navigation"

import { RocketIcon } from "@radix-ui/react-icons"

import { UserCard } from "@/components/cards/user-card"
import {
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from "@/components/page-header"
import { Shell } from "@/components/shell"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { getCurrentUser } from "@/lib/auth"
import { authPages } from "@routes"
import { cn, wrapTrpcCall } from "@/lib/utils"
import { server } from "@/app/_trpc/server"
import { SearchInput } from "@/components/search-input"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { db } from "@/db"
import { UserFilterValues } from "@/schema/filter.schema"

export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_APP_URL),
  title: "Users",
  description: "Manage Users",
}

interface UsersPageProps {
  searchParams: {
    name?: string;
    page?: string;
  };
}

export default async function UsersPage({ searchParams: { name } }: UsersPageProps) {
  const user = await getCurrentUser()

  if (!user) redirect(authPages.login)

  const onData = await db.user.findMany({
    where: {
      name: {
        contains: name
      }
    },

    select: {
      id: true,
      name: true,
      isOnboarded: true
    },
    orderBy: {
      isOnboarded: {
        sort: 'asc', nulls: 'last'
      }
    }
  })



  const filterValues: UserFilterValues = {
    name
  };

  return (
    <ScrollArea className="h-[calc(100vh_-_65px)]">
      <Shell>

        <PageHeader>
          <div className="flex space-x-4">
            <PageHeaderHeading size="sm" className="flex-1">
              Users
            </PageHeaderHeading>
          </div>
          <PageHeaderDescription size="sm">
            Manage Users
          </PageHeaderDescription>
        </PageHeader>
        <SearchInput placeholder="Search User" className="bg-white h-11" defaultValues={filterValues} />
        <Alert>
          <RocketIcon className="h-4 w-4" aria-hidden="true" />
          <AlertTitle>Heads up!</AlertTitle>
          <AlertDescription>
            You are currently on the{" "}
            <span className="font-semibold">Basic</span> plan.
            You can create up to{" "}
            <span className="font-semibold">1</span> stores and{" "}
            <span className="font-semibold">2</span> products on
            this plan.
          </AlertDescription>
        </Alert>
        <section className={cn("grid gap-6 sm:grid-cols-2 lg:grid-cols-3")}>

          {onData && onData?.map((user) => (

            <UserCard key={user.id} href={`users/${user.id}`} user={user} />
          )
          )}
        </section>
      </Shell>
      <ScrollBar color="#000000" />
    </ScrollArea>

  )
}
