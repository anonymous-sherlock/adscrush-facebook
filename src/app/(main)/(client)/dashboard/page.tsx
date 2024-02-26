import { AccountStatus } from "@/components/AccountStatus";
import { InfoCard } from "@/components/dashboard/info-card";
import { RecentPayments } from "@/components/dashboard/recent-payments";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { db } from "@/db";
import { getCurrentIsOnboarded, getCurrentUser } from "@/lib/auth";
import { ONBOARDING_REDIRECT, authPages } from "@routes";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import { Overview } from "./_components/overview";
import { wrapServerCall } from "@/lib/utils";
import { server } from "@/app/_trpc/server";
import { PageHeader, PageHeaderDescription, PageHeaderHeading } from "@/components/page-header";
import { DataTable } from "@/components/template/_bonus_table/data-table";
import { columns } from "@/components/template/_bonus_table/columns";
import React from "react";
import { bonus } from "@/server/api/bonus";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Adscrush Dashboard Rent your account.",
};

async function DashboardPage() {
  const user = await getCurrentUser();
  const isOnboarded = await getCurrentIsOnboarded();
  if (!user) redirect(authPages.login);
  if (!isOnboarded && user.role !== "ADMIN") redirect(ONBOARDING_REDIRECT);

  const onboardedUser = await db.user.findFirst({
    where: { id: user.id },
    select: { isOnboarded: true, onboarding: true },
  });

  if (onboardedUser && onboardedUser.onboarding && onboardedUser.onboarding.status !== "Verified") {
    return <AccountStatus status={onboardedUser.onboarding.status} />;
  }

  const payments = await wrapServerCall(() => server.payment.getAll({ limit: 5 }));
  const paymentsCount = await wrapServerCall(() => server.payment.getTotalPaymentCount());
  const bonusCount = await bonus.count(user.id)
  const bonuses = await bonus.getAll(user.id)

  return (
    <>
      {/* main dashboard */}
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <PageHeader className="flex-1">
            <PageHeaderHeading size="sm">Dashboard</PageHeaderHeading>
            <PageHeaderDescription size="sm">View your account activity.</PageHeaderDescription>
          </PageHeader>
        </div>
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="bonus">Bonus History</TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="space-y-4">
            <InfoCard userId={user.id} />
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
                  <CardDescription>You made {paymentsCount || 0} transaction total.</CardDescription>
                </CardHeader>
                <CardContent>
                  <RecentPayments payments={payments ?? []} />
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          <TabsContent value="bonus">
            <React.Suspense>
              <Card className="col-span-3 !mt-0">
                <CardHeader>
                  <CardTitle>Bonus history</CardTitle>
                  <CardDescription>
                    You have {bonusCount ?? 0} Bonus History.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <DataTable data={bonuses ?? []} columns={columns} />
                </CardContent>
              </Card>
            </React.Suspense>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}

export default DashboardPage;
