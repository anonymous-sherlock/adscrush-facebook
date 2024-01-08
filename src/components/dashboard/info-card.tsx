"use server"
import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Icons } from '../Icons'
import { formatPrice, wrapTrpcCall } from '@/lib/utils';
import { server } from '@/app/_trpc/server';

interface InfoCardProps {

}

export async function InfoCard({ }: InfoCardProps) {
    const data = await wrapTrpcCall(() => server.dashboard.getDetails());
    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                        Total Revenue
                    </CardTitle>
                    <Icons.revenue className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{formatPrice(data?.wallet.balance ?? 0,)}</div>
                    <p className="text-xs text-muted-foreground">
                        Lifetime revenue
                    </p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                        Available Balance
                    </CardTitle>
                    <Icons.userGroup className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{formatPrice(data?.wallet.balance ?? 0,)}</div>
                    <p className="text-xs text-muted-foreground">
                        Balance you can avaible to withdraw
                    </p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">withdrawal</CardTitle>
                    <Icons.withdrawal className="h-4 w-4 text-muted-foreground" />

                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">₹ 4,000</div>
                    <p className="text-xs text-muted-foreground">
                        This much amount you have withdrawn
                    </p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                        Daily Bonus /Day
                    </CardTitle>
                    <Icons.active className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">+{data?.bonus.dailyLimit} INR</div>
                    <p className="text-xs text-muted-foreground">
                        Rupees will be added Daily.
                    </p>
                </CardContent>
            </Card>
        </div>
    )
}
