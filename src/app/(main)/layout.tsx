import DashboardHeader from '@/components/dashboard/dashboard-header'
import { FC } from 'react'
interface MainLayoutProps {
    children: React.ReactNode
}

const MainLayout: FC<MainLayoutProps> = ({ children }: MainLayoutProps) => {
    return (
        <div className="grainy">
            <DashboardHeader />
            {children}
        </div>
    )
}

export default MainLayout