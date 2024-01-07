import { v4 as uuidv4 } from "uuid";
import { getVerificationTokenByEmail } from "../data/verification-token";
import { db } from "@/db";
import { DEFAULT_VERIFICTAION_TOKEN_EXPIRE_TIME } from "@/constants/token";
import { generateVerifyCode } from "../utils";

export const generateVerificationToken = async (email: string) => {
  const token = uuidv4();
  const expires = new Date(new Date().getTime() + DEFAULT_VERIFICTAION_TOKEN_EXPIRE_TIME);

  const existingToken = await getVerificationTokenByEmail(email);

  if (existingToken) {
    await db.verificationToken.delete({
      where: {
        id: existingToken.id,
      },
    });
  }

  const verficationToken = await db.verificationToken.create({
    data: {
      email,
      token,
      expires,
    }
  });

  return verficationToken;
};


export const generateOnboardingEmailVerificationToken = async (email: string) => {
  const token = generateVerifyCode()
  const expires = new Date(new Date().getTime() + DEFAULT_VERIFICTAION_TOKEN_EXPIRE_TIME);

  const existingToken = await db.onboardingEmailVerification.findUnique({
    where: { email: email }
  })

  if (existingToken) {
    await db.onboardingEmailVerification.delete({
      where: {
        id: existingToken.id,
      },
    });
  }

  const verficationToken = await db.onboardingEmailVerification.create({
    data: {
      email,
      token,
      expires,
    }
  });

  return verficationToken;
};