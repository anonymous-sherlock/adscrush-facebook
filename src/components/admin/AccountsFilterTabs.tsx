"use client"
import {
    Tabs,
    TabsList,
    TabsTrigger
} from "@/components/ui/tabs"
import { AccountsFilterValues } from "@/schema/filter.schema"
import { useRouter } from "next/navigation"
import { FC } from 'react'
interface AccountsFilterTabsProps {
    defaultValues: AccountsFilterValues
}

const AcoountsFilterTabs: FC<AccountsFilterTabsProps> = ({ defaultValues }) => {
    const { q, status } = defaultValues
    const router = useRouter()
    function handleUsersFilter(value: AccountsFilterValues["status"]) {
        const searchParams = new URLSearchParams({
            ...(q && { q }),
            ...(value && { status: value }),
        });
        const url = `/admin/accounts/?${searchParams}`
        router.push(url)
    }

    return (
        <Tabs defaultValue={status || "All"} onValueChange={(value) => handleUsersFilter(value as AccountsFilterValues["status"])}>
            <TabsList className="bg-secondary border">
                <TabsTrigger value="All">All</TabsTrigger>
                <TabsTrigger value="Verified">Verified</TabsTrigger>
                <TabsTrigger value="Hold">Hold</TabsTrigger>
                <TabsTrigger value="Declined">Declined</TabsTrigger>
            </TabsList>
        </Tabs>
    )
}

export default AcoountsFilterTabs