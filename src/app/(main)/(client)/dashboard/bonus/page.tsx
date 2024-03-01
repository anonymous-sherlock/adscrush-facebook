import { CalendarDateRangePicker } from '@/components/global/date-range-picker'
import { columns } from '@/components/template/bonus_table/columns'
import { DataTable } from '@/components/template/bonus_table/data-table'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { getCurrentUser } from '@/lib/auth'
import { getDateFromParams } from '@/lib/helpers/date'
import { bonus } from '@/server/api/bonus'
import { BonusSearchParams } from '@/types'
import { authPages } from '@routes'
import { redirect } from 'next/navigation'
import React, { FC } from 'react'

interface BonusPageProps {
    searchParams: BonusSearchParams
}

const page: FC<BonusPageProps> = async ({ searchParams: { date } }) => {
    const today = new Date();
    const { from, to } = getDateFromParams(date, today)

    const user = await getCurrentUser();
    if (!user) redirect(authPages.login);

    const [bonusCount, bonuses] = await Promise.all([
        bonus.count(user.id),
        bonus.getAll({ userId: user.id, date: { from, to } })
    ])

    return (
        <React.Suspense>
            <Card className="col-span-3 !mt-0">
                <CardHeader className="flex flex-col md:flex-row justify-between items-start pb-4 md:items-center">
                    <div>
                        <CardTitle>Bonus history</CardTitle>
                        <CardDescription>
                            You have {bonusCount ?? 0} Bonus History.
                        </CardDescription>
                    </div>
                </CardHeader>
                <CardContent>
                    <DataTable data={bonuses ?? []} columns={columns} />
                </CardContent>
            </Card>
        </React.Suspense>
    )
}

export default page