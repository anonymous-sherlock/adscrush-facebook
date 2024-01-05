import React from 'react'
import AccountSwitcher from './account-switcher'
import { MainNav } from './main-nav'
import UserAccountNav from '@/components/UserAccountNav'
import { getCurrentUser } from '@/lib/auth'
import { server } from '@/app/_trpc/server'

async function DashboardHeader() {
  const user = await getCurrentUser()

  const onboardingsName = await server.onboarding.getAllOnboardingName()

  return (
    <div className="border-b bg-white">
      <div className="flex h-16 items-center px-4">
        <AccountSwitcher onboardings={onboardingsName} />
        <MainNav className="mx-6" />
        <div className="ml-auto flex items-center space-x-4">
          <search />

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