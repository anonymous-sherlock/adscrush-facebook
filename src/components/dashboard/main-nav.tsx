"use client"
import { navConfig } from "@/config/site"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { buttonVariants } from "../ui/button"

export function MainNav({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  const segment = usePathname()
  return (
    <nav
      className={cn("hidden md:flex items-center gap-2", className)}
      {...props}
    >
      {navConfig.mainNav?.map(
        (item) =>
          item.href && (
            <Link key={item.href}
              href={item.href}
              className={cn(buttonVariants({ variant: 'ghost' }), "w-min-[500px] text-sm font-medium text-muted-foreground transition-colors hover:text-primary",
                segment === item.href && "bg-secondary text-primary"
              )}>
              {item.title}
            </Link>
          )
      )}
    </nav>
  )
}
