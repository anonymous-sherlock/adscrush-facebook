"use client"
import {
    Tabs,
    TabsList,
    TabsTrigger
} from "@/components/ui/tabs"
import Link from "next/link"
import { useRouter, useSelectedLayoutSegment } from "next/navigation"
import { ScrollArea } from "../ui/scroll-area"

export function DashboardTabs() {
    const router = useRouter()
    const segment = useSelectedLayoutSegment()

    const tabs = [
        {
            title: "Overview",
            href: `/dashboard`,
            isActive: segment === null,
        },
        {
            title: "Bonus History",
            href: `/dashboard/bonus`,
            isActive: segment === "bonus",
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
