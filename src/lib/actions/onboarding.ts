"use server"

import { FBOnboardingSchema } from "@/schema/onboarding.schema"

import { fileMetaDetailsSchema } from "@/types/fileUploader"
import { z } from "zod"
import { getCurrentUser } from "../auth"
import { db } from "@/db"
import { revalidatePath } from "next/cache"



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

    console.log(parserData)

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
          userId: user.id
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
          documentType: 'PRIMARY',
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
    revalidatePath(`/dashboard`)
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
    console.log(email, ", OTP : ", otp)

    return {
      success: "Email Verfied Successfully"
    }
  } catch (error) {
    console.log(error)
    return null
  }
}