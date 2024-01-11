import Link from "next/link"

import { getRandomPatternStyle } from "@/lib/generate-pattern"
import { cn } from "@/lib/utils"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import { Badge } from "@/components/ui/badge"
import {
	Card,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card"
import { RouterOutputs } from "@/server"

interface UserCardProps {
	user: RouterOutputs["admin"]["getUserCardDetails"][number]
	href: string
}

export function UserCard({ user, href }: UserCardProps) {
	return (
		<Link href={href}>
			<span className="sr-only">{user.name}</span>
			<Card className="h-full overflow-hidden transition-colors hover:bg-muted/50">
				<AspectRatio ratio={16 / 5}>
					<div className="absolute inset-0 bg-gradient-to-t from-black/5 to-zinc-950/60" />
					<Badge
						className={cn(
							"pointer-events-none absolute right-2 top-2 rounded-sm px-2 py-0.5 font-semibold",
							user.isOnboarded
								? "border-green-600/20 bg-green-100 text-green-700"
								: "border-red-600/10 bg-red-100 text-red-700"
						)}
					>
						{user.isOnboarded ? "Onboarded" : "Inactive"}
					</Badge>
					<div
						className="h-full rounded-t-md border-b"
						style={getRandomPatternStyle(String(user.id))}
					/>
				</AspectRatio>
				<CardHeader className="p-4 space-y-2">
					<CardTitle className="line-clamp-1 text-lg">{user.name}</CardTitle>
					<CardDescription className="line-clamp-1">
						Explore {user.name} acocount
					</CardDescription>
				</CardHeader>
			</Card>
		</Link>
	)
}
