import { server } from "@/app/_trpc/server";
import { AccountStatus } from "@/components/AccountStatus";
import { DashboardBonusChart } from "@/components/charts/dashboard-bonus-chart";
import { InfoCard } from "@/components/dashboard/info-card";
import { Overview } from "@/components/dashboard/overview";
import { RecentPayments } from "@/components/dashboard/recent-payments";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { db } from "@/db";
import { getCurrentIsOnboarded, getCurrentUser } from "@/lib/auth";
import { wrapServerCall } from "@/lib/utils";
import { bonus } from "@/server/api/bonus";
import { payment } from "@/server/api/payment";
import { ONBOARDING_REDIRECT, authPages } from "@routes";
import { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Adscrush Dashboard Rent your account.",
};
interface DashboardPageProps {
  searchParams: {
    date?: string;
  };
}
async function DashboardPage({ searchParams: { date } }: DashboardPageProps) {
  const [user, isOnboarded] = await Promise.all([
    getCurrentUser(),
    getCurrentIsOnboarded()
  ])
  if (!user) redirect(authPages.login);
  if (!isOnboarded && user.role !== "ADMIN") redirect(ONBOARDING_REDIRECT);

  const onboardedUser = await db.user.findFirst({
    where: { id: user.id },
    select: { isOnboarded: true, onboarding: true },
  });

  if (onboardedUser && onboardedUser.onboarding && onboardedUser.onboarding.status !== "Verified") {
    return <AccountStatus status={onboardedUser.onboarding.status} />;
  }

  const paymentsCountPromise = payment.count()
  const paymentsPromise = payment.getAll({ userId: user?.id, date: undefined, limit: 5 })
  const monthlyBonusesPromise = bonus.retrieveMonthlyBonuses(user.id)
  const thisYearAnalysisPromise = bonus.monthlyAnalysis(user.id)

  const [payments, paymentsCount, monthlyBonuses, thisYearAnalysis] = await Promise.all([
    paymentsPromise,
    paymentsCountPromise,
    monthlyBonusesPromise,
    thisYearAnalysisPromise
  ])

  return (
    <>
      <InfoCard userId={user.id} />
      <div className=" flex flex-col md:grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Bonus Overview</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <Overview data={monthlyBonuses} />
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
        {/* bonus card */}
        <Card className="col-span-7 p-10">
          <DashboardBonusChart data={thisYearAnalysis} />
        </Card>
      </div>
    </>
  );
}

export default DashboardPage;
