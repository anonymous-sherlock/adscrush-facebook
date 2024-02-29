import { AccountsTabs } from '@/components/tabs/user-account-tab'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import React, { FC } from 'react'

interface AccountslayoutProps {
    children: React.ReactNode
}

const layout: FC<AccountslayoutProps> = ({ children }) => {
    return (
        <React.Suspense>
            <AccountsTabs />
            {children}
        </React.Suspense>
    )
}

export default layout