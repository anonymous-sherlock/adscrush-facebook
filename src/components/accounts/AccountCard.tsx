"use client"
import { ONBOARDING_STATUS } from "@/constants/index";
import { Avatar, Button, Card, CardBody, CardFooter, CardHeader, Divider } from "@nextui-org/react";
import { Onboarding_Status } from "@prisma/client";
import { format } from "date-fns";
import { Plus } from "lucide-react";
import Link from "next/link";
import React from "react";
import { CustomBadge } from "../CustomBadge";
interface UserAccountCardProps {
  status: Onboarding_Status;
  id: string;
  name: string;
  createdAt: Date;
  profileLink: string
  username: string
  image: string
}


export const UserAccountCard = ({ createdAt, id, name, status, profileLink, username, image }: UserAccountCardProps) => {
  return (
    <Card shadow="none" className="hover:shadow-lg shadow transition">
      <CardHeader className="justify-between">
        <div className="flex gap-3">
          <Avatar isBordered radius="full" size="md" src={image} fallback />
          <Link href={`/admin/users/${id}`} >

            <div className="flex flex-col items-start justify-center">
              <h4 className="text-small font-semibold leading-none text-default-600">{name}</h4>
              <h5 className="text-small tracking-tight text-default-500">@{username}</h5>
            </div>
          </Link>
        </div>
        <Button
          color="primary"
          radius="full"
          size="sm"
          variant={"solid"}>
          <Link href={profileLink}>
            View Profile
          </Link>

        </Button>
      </CardHeader>
      <CardBody className="px-3 py-0">
        <div className="text-small pl-px text-default-500">
          <p>
            <b>Username</b>{" "}{username}
          </p>
          <p className="truncate">

            <b>Profile Link</b><span>{" "}{profileLink}</span> <br />
          </p>
        </div>
      </CardBody>
      <Divider className="mt-2" />
      <CardFooter className="flex items-center justify-between gap-3">
        <div className="flex gap-1 items-center justify-between">
          <Plus className="h-4 w-4 font-semibold text-default-600 text-small" />
          <p className="text-default-500 text-small">
            {format(new Date(createdAt), "MMM dd, yyyy - hh:mmaaa")}
          </p>
        </div>
        <CustomBadge badgeValue={status} status={ONBOARDING_STATUS} />
      </CardFooter>
    </Card>
  );
};
