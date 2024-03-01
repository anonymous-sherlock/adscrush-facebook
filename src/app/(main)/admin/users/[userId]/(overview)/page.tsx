"use server"
import { CalendarDateRangePicker } from '@/components/global/date-range-picker'
import { InfoCard } from '@/components/dashboard/info-card'
import { columns } from '@/components/template/bonus_table/columns'
import { DataTable } from '@/components/template/bonus_table/data-table'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { getUserById } from '@/lib/data/user'
import { bonus } from '@/server/api/bonus'
import { AdminUsersListParams, BonusSearchParams } from '@/types'
import { notFound } from 'next/navigation'
import React from 'react'
import { getDateFromParams } from '@/lib/helpers/date'

interface UserPageProps {
  params: AdminUsersListParams
  searchParams: BonusSearchParams
}
async function UserPage({ params: { userId }, searchParams: { date } }: UserPageProps) {
  const today = new Date();
  const { from, to } = getDateFromParams(date, today)

  const user = await getUserById(userId)
  if (!user) return notFound()
  const [bonusCount, bonuses] = await Promise.all([
    bonus.count(user.id),
    bonus.getAll({ userId: user.id, date: { from, to } })
  ])

  return (
    <>
      <div className="block w-full">
        <InfoCard userId={user.id} />
      </div>
      <React.Suspense>
        <Card className="col-span-3 !mt-0">
          <CardHeader className="flex flex-col md:flex-row justify-between items-center">
            <div>
              <CardTitle>Bonus history</CardTitle>
              <CardDescription>
                {user.name} has {bonusCount ?? 0} Bonus History.
              </CardDescription>
            </div>
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