import { InfoCard } from '@/components/dashboard/info-card'
import { PayoutForm } from '@/components/forms/payout-form'
import { columns } from '@/components/template/payments_table/columns'
import { DataTable } from '@/components/template/payments_table/data-table'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { getCurrentUser } from '@/lib/auth'
import { getDateFromParams } from '@/lib/helpers/date'
import { payment } from '@/server/api/payment'
import { PaymentSearchParams } from '@/types'
import React from 'react'

interface WalletPageProps {
  searchParams: PaymentSearchParams
}

async function WalletPage({ searchParams: { date } }: WalletPageProps) {
  const today = new Date();
  const { from, to } = getDateFromParams(date, today)
  const user = await getCurrentUser()
  const paymentsCountPromise = payment.count()
  const paymentsPromise = payment.getAll({ userId: user?.id, date: { from, to }, limit: undefined })

  const [payments, paymentsCount] = await Promise.all([
    paymentsPromise,
    paymentsCountPromise
  ])


  return (
    <>
      <div className='flex flex-col md:flex-row p-4 md:p-8 gap-4 items-stretch justify-stretch'>
        <InfoCard className='flex-1 lg:grid-cols-2' userId={user?.id ?? ""} />
        <PayoutForm className='shrink-0 w-full md:w-2/5 h-fit  mb-[-4px]' />
      </div>

      <div className="space-y-6 p-4 md:p-8 md:pt-0">
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