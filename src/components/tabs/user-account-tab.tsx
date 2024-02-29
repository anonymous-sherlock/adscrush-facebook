"use client"
import {
    Tabs,
    TabsList,
    TabsTrigger
} from "@/components/ui/tabs"
import Link from "next/link"
import { useParams, useRouter, useSelectedLayoutSegment } from "next/navigation"
import { Separator } from "../ui/separator"
import { ScrollArea } from "../ui/scroll-area"
import { cn } from "@/lib/utils"
import { AdminUsersListParams } from "@/types"

export function AccountsTabs() {
    const { userId } = useParams<AdminUsersListParams>()
    const router = useRouter()
    const segment = useSelectedLayoutSegment()

    const tabs = [
        {
            title: "Profile",
            href: `/admin/users/${userId}/accounts`,
            isActive: segment === null,
        },
        {
            title: "Password",
            href: `/admin/users/${userId}/accounts/password`,
            isActive: segment === "password",
        },
        {
            title: "Integration",
            href: `/admin/users/${userId}/accounts/integration`,
            isActive: segment === "integration",
        },
    ]

    return (
        <Tabs
            defaultValue={tabs.find((tab) => tab.isActive)?.href ?? tabs[0]?.href}
            onValueChange={(value) => router.push(value)}
        >
            <ScrollArea
                orientation="horizontal"
                className="pb-2.5">
                <TabsList className="bg-secondary border">
                    {tabs.map((tab) => (
                        <div role="none" key={tab.href}>
                            <TabsTrigger value={tab.href} asChild>
                                <Link href={tab.href}>{tab.title}</Link>
                            </TabsTrigger>
                        </div>
                    ))}
                </TabsList>
            </ScrollArea>
        </Tabs >
    )
}
