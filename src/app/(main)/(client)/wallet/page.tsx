import { server } from '@/app/_trpc/server'
import { InfoCard } from '@/components/dashboard/info-card'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { PayoutForm } from '@/components/forms/payout-form'
import { getCurrentUser } from '@/lib/auth'
import { wrapServerCall } from '@/lib/utils'
import { SearchParams } from '@/types'
import React from 'react'
import { columns } from '@/components/template/payments_table/columns'
import { DataTable } from '@/components/template/payments_table/data-table'

interface WalletPageProps {
  searchParams: SearchParams
}

async function WalletPage({ searchParams }: WalletPageProps) {

  const user = await getCurrentUser()

  const [payments, paymentsCount] = await Promise.all([
    await wrapServerCall(() => server.payment.getAll({ limit: undefined })),
    await wrapServerCall(() => server.payment.getTotalPaymentCount())
  ])


  return (
    <>
      <div className='flex flex-col md:flex-row p-4 md:p-8 gap-4 items-stretch justify-stretch'>
        <InfoCard className='flex-1 lg:grid-cols-2' userId={user?.id ?? ""} />
        <PayoutForm className='shrink-0 w-full md:w-2/5 h-fit  mb-[-4px]' />
      </div>

      <div className="space-y-6 p-4 md:p-8 pt-0">
        <div className="flex flex-col gap-4 xs:flex-row xs:items-center xs:justify-between">
        </div>
        <React.Suspense>
          <Card className="col-span-3 !mt-0">
            <CardHeader>
              <CardTitle>Recent Transaction</CardTitle>
              <CardDescription>
                You made {paymentsCount ?? 0} transaction total.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <DataTable data={payments ?? []} columns={columns} />
            </CardContent>
          </Card>
        </React.Suspense>
      </div>

    </>
  )
}

export default WalletPage