"use client"
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable'
import { Separator } from '@/components/ui/separator'
import { TooltipProvider } from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'
import logo from '@/public/logo.png'
import {
    Inbox,
    Users2
} from "lucide-react"
import Image from 'next/image'
import React, { PropsWithChildren } from 'react'
import { Nav } from './nav'
import { navConfig } from '@/config/site'

interface AdminSidebarProps extends PropsWithChildren {
    defaultLayout: number[] | undefined
    defaultCollapsed?: boolean
    navCollapsedSize: number
}

function AdminSidebar({
    defaultLayout = [200, 440, 655],
    defaultCollapsed = false,
    navCollapsedSize,
    children
}: AdminSidebarProps) {
    const [isCollapsed, setIsCollapsed] = React.useState<boolean>(defaultCollapsed)

    return (
        <TooltipProvider delayDuration={0}>
            <ResizablePanelGroup
                direction="horizontal"
                onLayout={(sizes: number[]) => {
                    document.cookie = `react-resizable-panels:layout=${JSON.stringify(
                        sizes
                    )}`
                }}
                className="h-full min-h-[calc(100vh_-_65px)] items-stretch hidden md:flex"
            >
                <ResizablePanel
                    defaultSize={defaultLayout[0]}
                    collapsedSize={navCollapsedSize}
                    collapsible={true}
                    color='black'
                    minSize={17}
                    maxSize={17}
                    onCollapse={() => {
                        setIsCollapsed(true)
                    }}
                    onExpand={() => {
                        setIsCollapsed(false)
                    }}


                    className={cn("bg-white hidden md:block", isCollapsed && "min-w-[50px] max-w-[50px] hidden md:block transition-all duration-300 ease-in-out")}
                >
                    <div className={cn("flex gap-2 h-[56px] items-center justify-center", isCollapsed ? 'h-[52px]' : 'px-2')}>
                        <Image src={logo.src} width={32} height={32} alt='Logo' className='rounded-sm' />

                        {!isCollapsed ? <p className='grow font-semibold'>Adscrush</p> : null}
                    </div>
                    <Separator />
                    <Nav
                        isCollapsed={isCollapsed}
                        links={navConfig.adminSidebarNav[0].items.map((item) => ({
                            title: item.title,
                            label: item.label || "",
                            icon: item.icon || "users2",
                            variant: "ghost",
                            href: item.href || "",
                        }))}
                    />

                </ResizablePanel>
                <ResizableHandle className='hidden md:flex' withHandle onDoubleClick={(e) => {
                    // Fix: Update setIsCollapsed with a new value, for example, toggle the previous value
                    setIsCollapsed((prev) => !prev);
                }}
                />
                <ResizablePanel defaultSize={defaultLayout[1]} minSize={30}>
                    {children}
                </ResizablePanel>

            </ResizablePanelGroup>
        </TooltipProvider>
    )
}

export default AdminSidebar