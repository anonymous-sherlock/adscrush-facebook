import { db } from "@/db";
import { cn } from "@/lib/utils";
import { UserFilterValues } from "@/schema/filter.schema";
import { Prisma } from "@prisma/client";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Link from "next/link";
import { UserCard } from "../cards/user-card";
import { buttonVariants } from "../ui/button";

interface UsersResultsProps {
    filterValues: UserFilterValues;
    page?: number;
}

export default async function UsersResults({
    filterValues,
    page: searchPage = 1,
}: UsersResultsProps) {
    const { name, onboarded } = filterValues;
    const usersPerPage = 9;
    const page = isNaN(searchPage) ? 1 : searchPage
    const skip = (page - 1) * usersPerPage;

    const searchString = name
        ?.split(" ")
        .filter((word) => word.length > 0)
        .join(" & ");

    const searchFilter: Prisma.UserWhereInput = searchString
        ? {
            OR: [
                { name: { search: searchString, } },
                { name: { contains: searchString } },
                { email: { search: searchString } },
            ],
        }
        : {};

    const where: Prisma.UserWhereInput = {
        AND: [
            searchFilter,
            onboarded && onboarded === "all" ? {} : {},
            onboarded === "onboarded" ? { isOnboarded: { not: null } } : {},
            onboarded === "not_onboarded" ? { isOnboarded: { equals: null } } : {}

        ],
    };

    const usersPromise = db.user.findMany({
        where,
        select: {
            id: true,
            name: true,
            isOnboarded: true
        },
        orderBy: { isOnboarded: { sort: 'asc', nulls: 'last' } },
        take: usersPerPage,
        skip,
    });

    const countPromise = db.user.count({ where });

    const [users, totalResults] = await Promise.all([usersPromise, countPromise]);

    return (
        <div className="grow space-y-4">
            <section className={cn("grid gap-6 sm:grid-cols-2 lg:grid-cols-3")}>
                {users.map((user) => (
                    <UserCard key={user.id} href={`users/${user.id}`} user={user} />
                ))}
            </section>
            {users.length === 0 && (
                <p className="m-auto text-center">
                    No Users found. Try adjusting your search filters.{" "}<Link href="/admin/users/?" className={cn(buttonVariants({ variant: "link" }))}>Clear Filters</Link>
                </p>
            )}
            {users.length > 0 && (
                <Pagination
                    currentPage={page}
                    totalPages={Math.ceil(totalResults / usersPerPage)}
                    filterValues={filterValues}
                />
            )}
        </div>
    );
}

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    filterValues: UserFilterValues;
}

function Pagination({
    currentPage,
    totalPages,
    filterValues: { name, onboarded },
}: PaginationProps) {
    function generatePageLink(page: number) {
        const searchParams = new URLSearchParams({
            ...(name && { name }),
            ...(onboarded && { onboarded: onboarded }),
            page: page.toString(),
        });

        return `/admin/users/?${searchParams.toString()}`;
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
