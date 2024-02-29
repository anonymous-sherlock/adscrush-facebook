"use server"
import { InfoCard } from '@/components/dashboard/info-card'
import { columns } from '@/components/template/bonus_table/columns'
import { DataTable } from '@/components/template/bonus_table/data-table'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { getUserById } from '@/lib/data/user'
import { bonus } from '@/server/api/bonus'
import { AdminUsersListParams } from '@/types'
import { notFound } from 'next/navigation'
import React from 'react'

interface UserPageProps {
  params: AdminUsersListParams
}
async function UserPage({ params: { userId } }: UserPageProps) {
  const user = await getUserById(userId)
  if (!user) return notFound()
  const bonusCount = await bonus.count(user.id)
  const bonuses = await bonus.getAll(user.id)
  return (
    <>
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
    </>

  )
}

export default UserPage