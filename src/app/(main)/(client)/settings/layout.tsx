
import {
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from "@/components/page-header"

import { Shell } from "@/components/shell"
import { SettingsTabs } from "@/components/tabs/settings-tab"

interface StoreLayoutProps extends React.PropsWithChildren {
  params: {
    storeId: string
  }
}

export default async function StoreLayout({
  children,
  params,
}: StoreLayoutProps) {



  return (
    <Shell>
      <div className="flex flex-col gap-2 pr-1 xxs:flex-row">
        <PageHeader className="flex-1">
          <PageHeaderHeading size="sm">Account Settings</PageHeaderHeading>
          <PageHeaderDescription size="sm">
            Manage your Account
          </PageHeaderDescription>
        </PageHeader>

      </div>
      <div>
        <SettingsTabs />
        <div className="overflow-hidden mt-4">{children}</div>
      </div>
    </Shell>
  )
}
