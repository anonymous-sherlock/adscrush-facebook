import { AccountsListReults } from '@/components/accounts/AccountsDashboard'
import AcoountsFilterTabs from '@/components/admin/AccountsFilterTabs'
import { AccountsSearchInput } from '@/components/admin/accounts-search-input'
import { PageHeader, PageHeaderDescription, PageHeaderHeading } from '@/components/page-header'
import { Shell } from '@/components/shell'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { AccountsFilterValues } from '@/schema/filter.schema'
import { FC } from 'react'

interface AccountsPageProps {
    searchParams: {
        q?: string;
        page?: string;
        status?: AccountsFilterValues["status"]
    };
}

const AccountsListPage: FC<AccountsPageProps> = ({ searchParams: { page, q, status } }) => {
    const filterValues: AccountsFilterValues = {
        q, status
    };
    return (
        <ScrollArea className="h-[calc(100vh_-_65px)]">
            <Shell className="p-2 md:px-8">
                <PageHeader className="flex flex-col md:flex-row justify-between md:items-center">
                    <div>
                        <div className="flex space-x-4">
                            <PageHeaderHeading size="sm" className="flex-1">
                                Accounts
                            </PageHeaderHeading>
                        </div>
                        <PageHeaderDescription size="sm">
                            Manage Users Facebook Account
                        </PageHeaderDescription>
                    </div>
                    <AcoountsFilterTabs defaultValues={filterValues} />
                </PageHeader>
                <AccountsSearchInput placeholder="Search Accounts" className="bg-white h-11" defaultValues={filterValues} />
                <AccountsListReults
                    filterValues={filterValues}
                    page={page ? parseInt(page) : undefined}
                />
            </Shell>
            <ScrollBar color="#000000" />
        </ScrollArea>

    )
}
export default AccountsListPage