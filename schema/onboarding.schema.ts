import { DOCUMENT_OPTIONS } from "@/constants/index";
import { getFileExtension } from "@/lib/helpers";
import { z } from "zod";


export const singleDocIDSchema = z.object({
  name: z.string(),
  size: z.number(),
  type: z.string(),

});
export const ACCEPTED_IMAGE_EXTENSIONS = ["jpg", "jpeg", "png", "webp", "svg", "pdf"];


const primaryIdSchema = z.object({
  name: z.string().default("Aadhaar ID"),
  files: z
    .unknown()
    .refine((val) => {
      if (!Array.isArray(val)) return false
      if (val.some((file) => !(file instanceof File))) return false
      return true
    }, "Must be an array of File")
    .optional()
    .nullable()
    .default(null),
})

export const FBOnboardingSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }).max(255),
  email: z.string().email({ message: "Invalid Email" }),
  phone: z.string().refine(value => /^\+?\d{10,13}$/.test(value), {
    message: "Invalid Phone Number. Should be a 10-digit number",
  }),
  fbUsername: z.string().min(1).max(255),
  fbPassword: z.string().min(4),
  fbProfileLink: z.string().url({ message: "Invalid profile link" }),

  primaryID: primaryIdSchema,
  alternativeID: z.string().refine((value) => DOCUMENT_OPTIONS.includes(value)),
  dob: z.date({
    required_error: "A date of birth is required.",
  }),
  gender: z.enum(["Male", "Female", "Other"], { required_error: "Gender is required" }),

  alternativeIDFile: z
    .unknown()
    .refine((val) => {
      if (!Array.isArray(val)) return false
      if (val.some((file) => !(file instanceof File))) return false
      return true
    }, "Must be an array of File")
    .optional()
    .nullable()
    .default(null),
})

