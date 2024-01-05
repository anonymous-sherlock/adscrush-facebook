import { FC } from 'react'
import DashboardHeader from './dashboard/_components/dashboard-header'
interface MainlayoutProps {
    children: React.ReactNode
}

const MainLayout: FC<MainlayoutProps> = ({ children }: MainlayoutProps) => {
    return (
        <div className="hidden flex-col md:flex">
            <DashboardHeader />
            {children}
        </div>
    )
}

export default MainLayout