"use server"
import { server } from '@/app/_trpc/server'
import UserAccountNav from '@/components/UserAccountNav'
import { WalletBalance } from '@/components/wallet/WalletBallance'
import { db } from '@/db'
import { getCurrentUser } from '@/lib/auth'
import { wrapServerCall } from '@/lib/utils'
import { ONBOARDING_REDIRECT } from '@routes'
import { redirect } from 'next/navigation'
import AccountSwitcher from './account-switcher'
import { MainNav } from './main-nav'
import { MobileNav } from '../global/mobile-nav'

async function DashboardHeader() {
  const user = await getCurrentUser()

  const onboardingName = await wrapServerCall(() => server.onboarding.getOnboardingName());
  if (!onboardingName && user?.role !== "ADMIN") redirect(ONBOARDING_REDIRECT)


  const wallet = await db.wallet.findFirst({ where: { user: { id: user?.id } } })

  return (
    <div className="border-b bg-white">
      <div className="flex h-16 items-center px-4">
        <MobileNav />
        {onboardingName ?
          <AccountSwitcher onboarding={onboardingName} /> : null
        }
        <MainNav className="mx-6" />
        <div className="ml-auto flex items-center space-x-4">


          <WalletBalance balance={wallet?.balance ?? 0} />
          <UserAccountNav
            name={
              !user?.name
                ? 'Your Account'
                : `${user?.name}`
            }
            email={user?.email ?? ''}
            imageUrl={user?.image ?? ''}
            user={user || undefined}
          />

        </div>
      </div>
    </div>
  )
}

export default DashboardHeader