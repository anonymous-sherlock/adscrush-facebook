"use client"
import {
    Tabs,
    TabsList,
    TabsTrigger
} from "@/components/ui/tabs"
import { UserFilterValues } from "@/schema/filter.schema"
import { useRouter } from "next/navigation"
import { FC } from 'react'
interface UserFilterTabsProps {
    defaultValues: UserFilterValues
}

const UserFilterTabs: FC<UserFilterTabsProps> = ({ defaultValues }) => {
    const { name, onboarded } = defaultValues
    const router = useRouter()

    function handleUsersFilter(value: UserFilterValues["onboarded"]) {
        const searchParams = new URLSearchParams({
            ...(name && { name }),
            ...(value && { onboarded: value }),
        });
        const url = `/admin/users/?${searchParams}`
        router.push(url)
    }

    return (
        <Tabs defaultValue={defaultValues.onboarded || "all"} onValueChange={(value) => handleUsersFilter(value as UserFilterValues["onboarded"])}>
            <TabsList className="bg-secondary border">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="onboarded">Onboarded</TabsTrigger>
                <TabsTrigger value="not_onboarded">Not Onboarded</TabsTrigger>
            </TabsList>
        </Tabs>
    )
}

export default UserFilterTabs