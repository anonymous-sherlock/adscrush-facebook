import { FC } from 'react'
import DashboardHeader from '@/components/dashboard/dashboard-header'
interface ClientLayoutProps {
    children: React.ReactNode
}

const ClientLayout: FC<ClientLayoutProps> = ({ children }: ClientLayoutProps) => {
    return (
        <div className="">
            <DashboardHeader />
            {children}
        </div>
    )
}

export default ClientLayout