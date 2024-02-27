import { AdminProtected } from "@/components/protected/admin-protected"
import { cookies } from "next/headers"
import { FC } from 'react'
import AdminSidebar from './admin-sidebar'
interface AdminLayout {
    children: React.ReactNode
}

const MainLayout: FC<AdminLayout> = ({ children }: AdminLayout) => {
    const layout = cookies().get("react-resizable-panels:layout")
    const defaultLayout = layout ? JSON.parse(layout.value) : undefined



    return (
        <div className="min-h-[calc(100vh_-_65px)]">
            <AdminProtected />
            <AdminSidebar defaultLayout={defaultLayout}
                defaultCollapsed={false}
                navCollapsedSize={4}
               >
                {children}
            </AdminSidebar>
        </div>
    )
}

export default MainLayout