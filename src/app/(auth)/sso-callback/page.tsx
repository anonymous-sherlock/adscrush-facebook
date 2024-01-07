

import { SSOCallback } from "@/components/auth/sso-callback"
import { Shell } from "@/components/shell"
import { db } from "@/db"

export interface SSOCallbackPageProps {
	searchParams: {
		token: string,
		callback: string,
		email: string
	}
}

export default function SSOCallbackPage({
	searchParams,
}: SSOCallbackPageProps) {

	const validToken = db.verificationToken.findUnique({
		where: {
			token: searchParams.token
		}
	})
	return (
		<Shell className=" w-full m-0 p-0 md:max-w-lg mx-auto">
			<SSOCallback searchParams={searchParams} />
		</Shell>
	)
}
