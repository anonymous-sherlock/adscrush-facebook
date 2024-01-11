"use server"

import { FBOnboardingSchema } from "@/schema/onboarding.schema"

import { db } from "@/db"
import { fileMetaDetailsSchema } from "@/types/fileUploader"
import { revalidatePath } from "next/cache"
import { z } from "zod"
import { getCurrentUser } from "../auth"
import { generateOnboardingEmailVerificationToken } from "../helpers/tokens"
import { sendOnboardingVerificationEmail } from "../mail"
import { ONBOARDING_REDIRECT } from "@routes"



const stipedOnboardingSchema = FBOnboardingSchema.omit({
  primaryID: true,
  alternativeID: true
})
const extendedOnboardingSchema = stipedOnboardingSchema.extend({
  emailVerified: z.boolean({ required_error: "Email is not verified" }),
  primaryIdName: z.string(),
  alternateIdName: z.string(),
  aadhaarFiles: z.array(fileMetaDetailsSchema).nullable(),
  alternateIdFiles: z.array(fileMetaDetailsSchema).nullable(),
})


export async function addDetails(
  rawInput: z.infer<typeof extendedOnboardingSchema>
) {
  try {
    const parserData = extendedOnboardingSchema.safeParse(rawInput)
    if (!parserData.success) {
      return {
        error: parserData.error.message ?? "Bad Request",
      }
    }
    const input = parserData.data

    if (!input.emailVerified) {
      return {
        error: "Email is not verified",
      }
    }
    const user = await getCurrentUser()

    if (!user) {
      return {
        error: "you are not authorized",
      }
    }

    const existingOnboarding = await db.onboarding.findFirst({ where: { userId: user.id } })

    if (existingOnboarding) {
      return {
        error: "You already have onboarded",
      }
    }

    const [onboardingDetails, userDetails] = await db.$transaction([
      db.onboarding.create({
        data: {
          name: input.name,
          email: input.email,
          phone: input.phone,
          facebook_username: input.fbUsername,
          facebook_password: input.fbPassword,
          facebook_profile_link: input.fbProfileLink,
          dob: input.dob,
          userId: user.id,
          emailVerified: input.emailVerified ? new Date() : null
        }
      }),
      db.user.update({
        where: {
          id: user.id
        },
        data: {
          isOnboarded: user.isOnboarded === null ? new Date() : user.isOnboarded
        }
      })
    ])

    const [primaryDocument, alternateDocument] = await db.$transaction([
      db.document.create({
        data: {
          name: input.primaryIdName,
          documentType: 'PRIMARY',
          userId: user.id,
          onboardingId: onboardingDetails.id,
          files: {
            createMany: {
              data: input.aadhaarFiles?.map((fileMeta) => ({
                name: fileMeta.fileName,
                size: fileMeta.fileSize,
                type: fileMeta.fileType,
                url: fileMeta.fileUrl,
                originalFileName: fileMeta.originalFileName,

              })) ?? [],
            },
          },
        },
      }),

      db.document.create({
        data: {
          name: input.alternateIdName,
          documentType: 'ALTERNATE',
          userId: user.id,
          onboardingId: onboardingDetails.id,
          files: {
            createMany: {
              data: input.alternateIdFiles?.map((fileMeta) => ({
                name: fileMeta.fileName,
                size: fileMeta.fileSize,
                type: fileMeta.fileType,
                url: fileMeta.fileUrl,
                originalFileName: fileMeta.originalFileName,

              })) ?? [],
            },
          },
        },
      })
    ])
    revalidatePath(ONBOARDING_REDIRECT)
    return {
      success: "Onboarded Successfully",
    }
  } catch (error) {
    console.log(error)
    return null
  }
}


const validateOtpSchema = z.object({
  email: z.string().email(), otp: z.string()
})
export async function validateOtp(
  rawInput: z.infer<typeof validateOtpSchema>
) {
  try {
    const parserData = validateOtpSchema.safeParse(rawInput)
    if (!parserData.success) {
      return {
        error: parserData.error.message ?? "Bad Request",
      }
    }
    const { email, otp } = parserData.data
    const existingToken = await db.onboardingEmailVerification.findUnique({
      where: { email: email, token: otp }
    });

    if (!existingToken) {
      return { error: "Otp is not valid or expired!" };
    }

    const hasExpired = new Date(existingToken.expires) < new Date();

    if (hasExpired) {
      return { error: "Otp has expired!" };
    }


    await db.onboardingEmailVerification.delete({
      where: { id: existingToken.id }
    });

    return { success: "Email verified Successfully!" };
  } catch (error) {
    console.log(error)
    return null
  }
}

export async function sendOnboardingEmailVerifyCode(email: string) {
  try {
    const verificationToken = await generateOnboardingEmailVerificationToken(email)
    await sendOnboardingVerificationEmail(
      verificationToken.email,
      verificationToken.token,
    );

  } catch (error) {
    console.log(error)
    return null
  }
}