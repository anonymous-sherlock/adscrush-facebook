import { AccountStatus } from '@/components/AccountStatus'
import { InfoCard } from '@/components/dashboard/info-card'
import { RecentPayments } from '@/components/dashboard/recent-payments'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { db } from '@/db'
import { getCurrentIsOnboarded, getCurrentUser } from '@/lib/auth'
import { ONBOARDING_REDIRECT, authPages } from '@routes'
import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { CalendarDateRangePicker } from './_components/date-range-picker'
import { Overview } from './_components/overview'

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Adscrush Dashboard Rent your account.",
}

async function DashboardPage() {
  const user = await getCurrentUser()
  const isOnboarded = await getCurrentIsOnboarded()
  if (!user) redirect(authPages.login)
  if (!isOnboarded) redirect(ONBOARDING_REDIRECT)

  const onboardedUser = await db.user.findFirst({
    where: { id: user.id },
    select: { isOnboarded: true, onboarding: true }
  })

  if (onboardedUser && onboardedUser.onboarding && onboardedUser.onboarding.status !== "Verified") {
    return <AccountStatus status={onboardedUser.onboarding.status} />
  }

  return (
    <>
      {/* main dashboard */}
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <div className="flex items-center space-x-2">
            <CalendarDateRangePicker />
            {/* <Button>Download</Button> */}
          </div>
        </div>
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="analytics" disabled>
              Analytics
            </TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="space-y-4">
            {/* <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Suspense fallback={<p>Loading feed...</p>}>
                <OverviewInfoCard title="Total Revenue" subTitle='5500' type='price' icon="revenue" />
              </Suspense>

              <OverviewInfoCard title="Last Month Revenue" subTitle='5500' type='price' icon='user' />
              <OverviewInfoCard title="Withdrawal" subTitle='5500' type='price' icon='withdrawal' />
              <OverviewInfoCard title="Bonus /Day" icon='active' subTitle='5500' />
            </div> */}
            <InfoCard />
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              <Card className="col-span-4">
                <CardHeader>
                  <CardTitle>Overview</CardTitle>
                </CardHeader>
                <CardContent className="pl-2">
                  <Overview />
                </CardContent>
              </Card>
              <Card className="col-span-3">
                <CardHeader>
                  <CardTitle>Recent Transaction</CardTitle>
                  <CardDescription>
                    You made 50 transaction this month.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <RecentPayments />
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>

    </>
  )
}

export default DashboardPage