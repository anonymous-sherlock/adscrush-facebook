import { db } from "@/db";
import { cn } from "@/lib/utils";
import { AccountsFilterValues, accountsFilterSchema } from "@/schema/filter.schema";
import { buttonVariants } from "@/ui/button";
import { Prisma } from "@prisma/client";
import Link from "next/link";
import { UserAccountCard } from "./AccountCard";
import { ArrowLeft, ArrowRight } from "lucide-react";

interface AccountsListReultsProps {
  filterValues: AccountsFilterValues;
  page?: number;
}
export const AccountsListReults = async ({ filterValues, page: searchPage = 1 }: AccountsListReultsProps) => {
  const { q, } = filterValues;
  let status = filterValues.status
  if (!accountsFilterSchema.safeParse({ status }).success) {
    status = "All";
  }
  const accountsPerPage = 9;
  const page = isNaN(searchPage) ? 1 : searchPage
  const skip = (page - 1) * accountsPerPage;

  const searchString = q
    ?.split(" ")
    .filter((word) => word.length > 0)
    .join(" & ");

  const searchFilter: Prisma.OnboardingWhereInput = searchString
    ? {
      OR: [
        { name: { search: searchString, } },
        { name: { contains: searchString } },
        { facebook_username: { search: searchString, } },
        { facebook_username: { contains: searchString } },
        { email: { search: searchString } },
      ],
    }
    : {};

  const where: Prisma.OnboardingWhereInput = {
    AND: [
      searchFilter,
      status && status === "All" ? {} : {},
      status !== "All" ? { status: status } : {},
    ],
  };
  const accountsPromise = db.onboarding.findMany({
    where,
    take: accountsPerPage,
    skip,
    include: {
      user: {
        select: { id: true, image: true }
      }
    }
  })
  const countPromise = db.onboarding.count({ where });
  const [accounts, totalResults] = await Promise.all([accountsPromise, countPromise]);

  return (
    <>
      <ul className="grid grid-cols-1 gap-6 divide-y divide-zinc-200 md:grid-cols-2 lg:grid-cols-3">
        {accounts.map((account) => (
          <UserAccountCard
            key={account.id}
            name={account.name}
            image={account.user?.image ?? ""}
            id={account.id}
            status={account.status}
            createdAt={account.createdAt}
            profileLink={account.facebook_profile_link}
            username={account.facebook_username}
          />
        ))}
      </ul>
      {accounts.length === 0 && (
        <p className="m-auto text-center">
          No Accounts found. Try adjusting your search filters.{" "}<Link href="/admin/accounts/?" className={cn(buttonVariants({ variant: "link" }))}>Clear Filters</Link>
        </p>
      )}
      {accounts.length > 0 && (
        <Pagination
          currentPage={page}
          totalPages={Math.ceil(totalResults / accountsPerPage)}
          filterValues={filterValues}
        />
      )}
    </>
  );
};

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  filterValues: AccountsFilterValues;
}

function Pagination({
  currentPage,
  totalPages,
  filterValues: { q, status },
}: PaginationProps) {
  function generatePageLink(page: number) {
    const searchParams = new URLSearchParams({
      ...(q && { q }),
      ...(status && { status: status }),
      page: page.toString(),
    });

    return `/admin/accounts/?${searchParams.toString()}`;
  }

  return (
    <div className="flex justify-between !mt-10">
      <Link
        href={generatePageLink(currentPage - 1)}
        className={cn(
          "flex items-center gap-2 font-semibold",
          currentPage <= 1 && "invisible",
        )}
      >
        <ArrowLeft size={16} />
        Previous page
      </Link>
      <span className="font-semibold">
        Page {currentPage} of {totalPages}
      </span>
      <Link
        href={generatePageLink(currentPage + 1)}
        className={cn(
          "flex items-center gap-2 font-semibold",
          currentPage >= totalPages && "invisible",
        )}
      >
        Next page
        <ArrowRight size={16} />
      </Link>
    </div>
  );
}
