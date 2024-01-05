import { DOCUMENT_OPTIONS } from "@/constants/index";
import { z } from "zod";


export const singleDocIDSchema = z.object({
  name: z.string(),
  size: z.number(),
  type: z.string(),

});


const primaryIdSchema = z.object({
  IDname: z.enum(["Aadhaar ID"]).default("Aadhaar ID"),
  files: z
    .unknown()
    .refine((val) => {
      if (!Array.isArray(val)) return false
      if (val.some((file) => !(file instanceof File))) return false
      return true
    }, "Must be an array of File")

})
const alternativeIDSchema = z.object({
  IDname: z.string({ required_error: "Alternate ID is required" }).min(1, { message: "Alternate ID is required" }).refine((value) => DOCUMENT_OPTIONS.includes(value), {
    message: "Alternate ID is required",
  }),
  files: z
    .unknown()
    .refine((val) => {
      if (!Array.isArray(val)) return false
      if (val.some((file) => !(file instanceof File))) return false
      return true
    }, "Must be an array of File")
})


export const FBOnboardingSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }).max(255),
  email: z.string().email({ message: "Invalid Email" }),
  phone: z.string().refine(value => /^\+?\d{10,13}$/.test(value), {
    message: "Invalid Phone Number. Should be a 10-digit number",
  }),
  fbUsername: z.string({required_error:"Facebook username is required"}).min(1,{message:"Facebook username is required"}).max(255),
  fbPassword: z.string({required_error:"Facebook password is required"}).min(1,{message:"Facebook password is required"}).min(4),
  fbProfileLink: z.string().url({ message: "Invalid profile link" }),
  primaryID: primaryIdSchema,
  alternativeID: alternativeIDSchema,
  dob: z.date({
    required_error: "A date of birth is required.",
  }),
  gender: z.enum(["Male", "Female", "Other"], { required_error: "Gender is required" }),
})

