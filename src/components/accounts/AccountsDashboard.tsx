"use client";
import { trpc } from "@/app/_trpc/client";
import { ONBOARDING_STATUS } from "@/constants/index";
import { cn } from "@/lib/utils";
import { ONBOARDING_REDIRECT } from "@routes";
import { format } from "date-fns";
import { Ghost, MoreHorizontal, Plus } from "lucide-react";
import Link from "next/link";
import Skeleton from "react-loading-skeleton";
import { CustomBadge } from "../CustomBadge";
import { buttonVariants } from "../ui/button";
import { UserAccountCard } from "./AccountCard";


const AccountsDashboard = () => {

  const { data: accounts, isLoading } = trpc.onboarding.getAll.useQuery();


  return (
    <main className="container  md:p-2 md:px-8">
      <div className="mt-8 flex flex-col items-start justify-between gap-4 border-b border-gray-200 pb-5 sm:flex-row sm:items-center sm:gap-0">
        <h1 className="mb-3 font-bold text-4xl text-gray-900">Accounts</h1>

        <Link href={ONBOARDING_REDIRECT} className={cn(buttonVariants({ variant: "secondary" }), "rounded-full")}>Add new Account</Link>
      </div>



      {/* display all user account */}
      {accounts && accounts?.length !== 0 ? (
        <ul className="mt-8 grid grid-cols-1 gap-6 divide-y divide-zinc-200 md:grid-cols-2 lg:grid-cols-3">
          {accounts
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
            .map((acc) => (
              <UserAccountCard
                key={acc.id}
                name={acc.name}
                id={acc.id}
                status={acc.status}
                createdAt={acc.createdAt}
                profileLink={acc.facebook_profile_link}
                username={acc.facebook_username}

              />

            ))}
        </ul>
      ) : isLoading ? (
        <Skeleton height={100} className="my-2" count={3} />
      ) : (
        <div className="mt-16 flex flex-col items-center gap-2">
          <Ghost className="h-8 w-8 text-zinc-800" />
          <h3 className="font-semibold text-xl">Pretty empty around here</h3>
          <p>Let&apos;s create your first campaign.</p>
        </div>
      )}
    </main>
  );
};

export default AccountsDashboard;
