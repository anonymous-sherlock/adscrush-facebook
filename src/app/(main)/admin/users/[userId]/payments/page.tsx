import { server } from '@/app/_trpc/server'
import { columns } from '@/components/template/payments_table/columns'
import { DataTable } from '@/components/template/payments_table/data-table'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { getUserById } from '@/lib/data/user'
import { wrapServerCall } from '@/lib/utils'
import { AdminUsersListParams } from '@/types'
import React from 'react'

interface UsersPaymentsPageProps {
  params: AdminUsersListParams
}

async function UsersPaymentsPage({ params: { userId } }: UsersPaymentsPageProps) {
  const user = await getUserById(userId)
  const [payments, paymentsCount] = await Promise.all([
    await wrapServerCall(() => server.payment.getAll({ limit: undefined, userId: user?.id })),
    await wrapServerCall(() => server.payment.getTotalPaymentCount({ userId: user?.id }))
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
