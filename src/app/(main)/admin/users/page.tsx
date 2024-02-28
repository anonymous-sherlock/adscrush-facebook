import UserFilterTabs from "@/components/admin/UserFilterTabs"
import UsersResults from "@/components/admin/UsersListResults"
import { UsersSearchInput } from "@/components/admin/search-input"
import {
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from "@/components/page-header"
import { Shell } from "@/components/shell"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { env } from "@/env.mjs"
import { getCurrentUser } from "@/lib/auth"
import { UserFilterValues } from "@/schema/filter.schema"
import { authPages } from "@routes"
import type { Metadata } from "next"
import { redirect } from "next/navigation"

export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_APP_URL),
  title: "Users",
  description: "Manage Users",
}

interface UsersPageProps {
  searchParams: {
    name?: string;
    page?: string;
    onboarded?: UserFilterValues["onboarded"]
  };
}

export default async function UsersPage({ searchParams: { name, page, onboarded } }: UsersPageProps) {
  const user = await getCurrentUser()
  if (!user) redirect(authPages.login)

  const filterValues: UserFilterValues = {
    name, onboarded
  };

  return (
    <ScrollArea className="h-[calc(100vh_-_65px)]">
      <Shell className="p-2 md:px-8">
        <PageHeader className="flex flex-col md:flex-row justify-between md:items-center">
          <div>
            <div className="flex space-x-4">
              <PageHeaderHeading size="sm" className="flex-1">
                Users
              </PageHeaderHeading>
            </div>
            <PageHeaderDescription size="sm">
              Manage Users
            </PageHeaderDescription>
          </div>
          <UserFilterTabs defaultValues={filterValues} />
        </PageHeader>
        <UsersSearchInput placeholder="Search User" className="bg-white h-11" defaultValues={filterValues} />
        {/* <Alert>
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
        </Alert> */}
        <UsersResults
          filterValues={filterValues}
          page={page ? parseInt(page) : undefined}
        />
      </Shell>
      <ScrollBar color="#000000" />
    </ScrollArea>

  )
}
