import { PageHeader, PageHeaderDescription, PageHeaderHeading } from '@/components/page-header'
import { Shell } from '@/components/shell'
import { AdminTabs } from '@/components/tabs/admin-tab'
import { ScrollArea } from '@/components/ui/scroll-area'
import { getUserById } from '@/lib/data/user'
import { notFound } from 'next/navigation'
import React, { FC } from 'react'

interface DynamicUsersLayout {
    children: React.ReactNode
    params: {
        userId: string
    }
}

const UsersLayout: FC<DynamicUsersLayout> = async ({ children, params: { userId } }: DynamicUsersLayout) => {
    const user = await getUserById(userId)
    if (!user) return notFound()
    return (
        <ScrollArea className="h-[calc(100vh_-_65px)]">
            <Shell className='flex flex-col gap-4 justify-start items-stretch mt-4'>
                <PageHeader>
                    <div className="flex space-x-4">
                        <PageHeaderHeading size="sm" className="flex-1">
                            {user.name}
                        </PageHeaderHeading>
                    </div>
                    <PageHeaderDescription size="sm">
                        Manage {user.name}{"'"}s Account
                    </PageHeaderDescription>
                    <AdminTabs className='mt-4' />
                </PageHeader>
                {children}
            </Shell>
        </ScrollArea>
    )
}


export default UsersLayout

