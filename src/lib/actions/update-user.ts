"use server";

import { db } from "@/db";
import { getCurrentUser } from "../auth";
import { ProfileFormValues } from "@/schema/user.schema";

type updateUserProfileType = ProfileFormValues;

export const updateUserProfile = async (rawData: updateUserProfileType) => {
  const user = await getCurrentUser();
  const { name, email, ...details } = rawData;
  try {
    const updatedUserPrefrence = await db.userPrefrence.upsert({
      where: {
        userId: user?.id,
      },
      create: {
        skype: details.skype,
        phone: details.phone,
        whatsapp: details.whatsapp,
        telegram: details.telegram,
        facebook: details.facebook,
        userId: user?.id,
      },
      update: details,
    });
    return { success: "updated user profile" };
  } catch (error) {
    console.log(error);
    return { error: "Cannot update user profile" };
  }
};
