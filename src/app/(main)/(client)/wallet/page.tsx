import { server } from '@/app/_trpc/server'
import { InfoCard } from '@/components/dashboard/info-card'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { PayoutForm } from '@/components/wallet/payout-form'
import { getCurrentUser } from '@/lib/auth'
import { wrapTrpcCall } from '@/lib/utils'
import { SearchParams } from '@/types'
import React from 'react'
import { columns } from './_table/columns'
import { DataTable } from './_table/data-table'

interface WalletPageProps {
  searchParams: SearchParams
}

async function WalletPage({ searchParams }: WalletPageProps) {

  const user = await getCurrentUser()

  const payments = await wrapTrpcCall(() => server.payment.getAll({ limit: undefined }))
  const paymentsCount = await wrapTrpcCall(() => server.payment.getTotalPaymentCount())



  return (
    <>
      <div className='flex flex-col  md:flex-row p-4 md:p-8 gap-4 items-stretch justify-stretch'>
        <InfoCard className='flex-1 lg:grid-cols-2' />
        <PayoutForm className='shrink-0 w-full md:w-2/5 h-fit  mb-[-4px]' />
      </div>

      <div className="space-y-6 p-8 pt-0">
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