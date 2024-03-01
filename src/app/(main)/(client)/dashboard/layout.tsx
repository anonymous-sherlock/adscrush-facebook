import { PageHeader, PageHeaderDescription, PageHeaderHeading } from "@/components/page-header"
import { DashboardTabs } from "@/components/tabs/dashboard-tab"



interface DashboardLayoutProps extends React.PropsWithChildren {
    children: React.ReactNode
}

export default async function DashboardLayout({
    children,
}: DashboardLayoutProps) {
    return (
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <PageHeader className="flex-1">
                    <PageHeaderHeading size="sm">Dashboard</PageHeaderHeading>
                    <PageHeaderDescription size="sm">View your account activity.</PageHeaderDescription>
                </PageHeader>
            </div>
            <DashboardTabs />
            <div className="space-y-4">
                {children}
            </div>
        </div>
    )
}
