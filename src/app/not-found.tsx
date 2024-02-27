import Header from "@/components/landing-page/header";
import { Shell } from "@/components/shell";
import { buttonVariants } from "@/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
export default function NotFound() {
    return (
        <>
            <Header />
            <main className="min-h-[calc(100vh_-200px)] h-full flex-col grainy flex justify-center items-center">
                <Shell className="flex flex-col items-center justify-center text-center">
                    <article className="rounded-full p-[1px] text-sm bg-gradient-to-r from-brand-primaryBlue to-brand-primaryPurple">
                        <div className="rounded-full px-3 py-1 bg-white" >
                            ✨ Monetize Your Facebook 🎉
                        </div>
                    </article>
                    <h1 className="max-w-4xl text-5xl font-bold md:text-6xl lg:text-7xl">
                        Oops <span className="text-blue-600">Page not </span>Found.
                    </h1>
                    <p className="mt-4 max-w-prose text-zinc-700 sm:text-lg">
                        Adscrush: Discover the opportunity to generate daily income by leasing your Facebook account,
                        Rent Your Facebook Account Earn Extra Income Today!
                    </p>

                    <Link
                        className={buttonVariants({
                            size: "lg",
                            className: "mt-5 w-auto",
                        })}
                        href="/"
                    >
                        Go Back to Home <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                </Shell>
            </main>
        </>
    );
}
