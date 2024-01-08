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
import { wrapTrpcCall } from "@/lib/utils"
import { server } from "@/app/_trpc/server"

export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_APP_URL),
  title: "Users",
  description: "Manage Users",
}

export default async function StoresPage() {
  const user = await getCurrentUser()

  if (!user) redirect(authPages.login)


  const data = await wrapTrpcCall(() => server.admin.getUserCardDetails())



  return (
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
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

        {data && data?.map((user) => (

          <UserCard key={user.id} href={user.id} user={user} />
        )
        )}
      </section>
    </Shell>
  )
}
