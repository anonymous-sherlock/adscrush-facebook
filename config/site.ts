import { MainNavItem, SidebarNavItem } from "@/types/nav"

export const siteConfig = {
    name: "Adscrush",
}

interface navsConfig {
    mainNav: MainNavItem[]
    sidebarNav?: SidebarNavItem[]
    adminSidebarNav: SidebarNavItem[]
}

export const navConfig: navsConfig = {
    mainNav: [
        {
            title: "Overview",
            href: "/dashboard",
            icon: "dashboard"
        },
        {
            title: "Wallet",
            href: "/wallet",
            icon: "wallet"
        },
        {
            title: "Settings",
            href: "/settings",
            icon: "settings"
        },
    ],
    adminSidebarNav: [
        {
            title: "Admin Dashboard",
            items: [
                {
                    title: "All Users",
                    href: "/admin/users",
                    items: [],
                    icon: "users2"
                },
                {
                    title: "All Accounts",
                    href: "/admin/accounts",
                    items: [],
                    icon: "inbox"
                },
            ],
        },
    ],
}
