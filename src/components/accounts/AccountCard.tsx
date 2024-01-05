import React from "react";
import { Avatar, Button, Card, CardBody, CardFooter, CardHeader} from "@nextui-org/react";
import Link from "next/link";
import { Onboarding_Status } from "@prisma/client";

interface UserAccountCardProps {
  status: Onboarding_Status;
  id: string;
  name: string;
  createdAt: Date;
  profileLink: string
  username: string
}

export const UserAccountCard = ({ createdAt, id, name, status, profileLink, username }: UserAccountCardProps) => {
  const [isFollowed, setIsFollowed] = React.useState(false);

  return (
    <Card shadow="none" className="hover:shadow-lg shadow transition">
      <CardHeader className="justify-between">
        <div className="flex gap-3">
          <Avatar isBordered radius="full" size="md" src="https://affilate.adscrush.com" fallback={"A"} />
          <div className="flex flex-col items-start justify-center">
            <h4 className="text-small font-semibold leading-none text-default-600">{name}</h4>
            <h5 className="text-small tracking-tight text-default-500">@{username}</h5>
          </div>
        </div>
        <Button
          className={isFollowed ? "bg-transparent text-foreground border-default-200" : ""}

          color="primary"
          radius="full"
          size="sm"
          variant={"solid"}
          onPress={() => setIsFollowed(!isFollowed)}
        >
          <Link href={profileLink}>
            View Profile
          </Link>

        </Button>
      </CardHeader>
      <CardBody className="px-3 py-0">
        <p className="text-small pl-px text-default-500">
          Full-stack developer, @getnextui lover she/her
          <span aria-label="confetti" role="img">
            🎉
          </span>
        </p>
      </CardBody>
      <CardFooter className="gap-3">
        <div className="flex gap-1">
          <p className="font-semibold text-default-600 text-small">4</p>
          <p className=" text-default-500 text-small">Following</p>
        </div>
        <div className="flex gap-1">
          <p className="font-semibold text-default-600 text-small">97.1K</p>
          <p className="text-default-500 text-small">Followers</p>
        </div>
      </CardFooter>
    </Card>
  );
};
