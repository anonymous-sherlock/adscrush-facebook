import { cookies } from "next/headers"
import { FC } from 'react'
import AdminSidebar from './admin-sidebar'
import { AdminProtected } from "@/components/protected/admin-protected"
import { admin } from "@/server/api/admin"
interface AdminLayout {
    children: React.ReactNode
}

const MainLayout: FC<AdminLayout> = async ({ children }: AdminLayout) => {
    const layout = cookies().get("react-resizable-panels:layout")
    const defaultLayout = layout ? JSON.parse(layout.value) : undefined
    const userCount = await admin.userCount() ?? 0
    const navItems = {
        userCount: userCount
    };

    return (
        <div className="min-h-[calc(100vh_-_65px)]">
            <AdminProtected />
            <AdminSidebar defaultLayout={defaultLayout}
                defaultCollapsed={false}
                navCollapsedSize={4}
                navItems={navItems} >
                {children}
            </AdminSidebar>
        </div>
    )
}

export default MainLayout