import { server } from '@/app/_trpc/server'
import { columns } from '@/components/template/payments_table/columns'
import { DataTable } from '@/components/template/payments_table/data-table'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { getUserById } from '@/lib/data/user'
import { getDateFromParams } from '@/lib/helpers/date'
import { isValidDateString, wrapServerCall } from '@/lib/utils'
import { payment } from '@/server/api/payment'
import { AdminUsersListParams, PaymentSearchParams } from '@/types'
import React from 'react'

interface UsersPaymentsPageProps {
  params: AdminUsersListParams
  searchParams: PaymentSearchParams
}

async function UsersPaymentsPage({ params: { userId }, searchParams: { date } }: UsersPaymentsPageProps) {
  const today = new Date();
  const { from, to } = getDateFromParams(date, today)
  const user = await getUserById(userId)
  const paymentsCountPromise = payment.count(user?.id)
  const paymentsPromise = payment.getAll({ userId: user?.id, date: { from, to }, limit: undefined })

  const [payments, paymentsCount] = await Promise.all([
    paymentsPromise,
    paymentsCountPromise
  ])


  return (
    <div className='block w-full'>
      <React.Suspense>
        <Card className="col-span-3 !mt-0">
          <CardHeader>
            <CardTitle>Recent Transaction</CardTitle>
            <CardDescription>
              {user?.name} has {paymentsCount ?? 0} transactions in total.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <DataTable data={payments ?? []} columns={columns} />
          </CardContent>
        </Card>
      </React.Suspense>
    </div>
  )
}

export default UsersPaymentsPage
