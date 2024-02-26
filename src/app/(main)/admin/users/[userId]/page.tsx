"use server"
import { InfoCard } from '@/components/dashboard/info-card'
import { PageHeader, PageHeaderDescription, PageHeaderHeading } from '@/components/page-header'
import { Shell } from '@/components/shell'
import { columns } from '@/components/template/_bonus_table/columns'
import { DataTable } from '@/components/template/_bonus_table/data-table'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { getUserById } from '@/lib/data/user'
import { bonus } from '@/server/api/bonus'
import { notFound } from 'next/navigation'
import React from 'react'

interface UserPageProps {
  params: {
    userId: string
  }
}
async function UserPage({ params: { userId } }: UserPageProps) {
  const user = await getUserById(userId)
  if (!user) return notFound()
  const bonusCount = await bonus.count(user.id)
  const bonuses = await bonus.getAll(user.id)
  return (
    <ScrollArea className="h-[calc(100vh_-_65px)]">
      <Shell className='flex flex-col gap-4 justify-start items-stretch mt-4'>
        <PageHeader>
          <div className="flex space-x-4">
            <PageHeaderHeading size="sm" className="flex-1">
              {user.name}
            </PageHeaderHeading>
          </div>
          <PageHeaderDescription size="sm">
            Manage {user.name} Account
          </PageHeaderDescription>
        </PageHeader>
        <div className="block w-full">
          <InfoCard userId={user.id} />
        </div>
        <React.Suspense>
          <Card className="col-span-3 !mt-0">
            <CardHeader>
              <CardTitle>Bonus history</CardTitle>
              <CardDescription>
                {user.name} has {bonusCount ?? 0} Bonus History.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <DataTable data={bonuses ?? []} columns={columns} />
            </CardContent>
          </Card>
        </React.Suspense>
      </Shell>
    </ScrollArea>
  )
}

export default UserPage