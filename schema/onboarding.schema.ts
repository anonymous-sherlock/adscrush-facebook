import { z } from "zod";

const alternativeIDs = ["Passport", "Driver's License", "Voter ID", "Other"];

export const FBOnboardingSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }).max(255),
  email: z.string().email({ message: "Invalid Email" }),
  phone: z.string().refine((value) => /^\d{10}$/g.test(value), {
    message: "Invalid Phone Number. Should be a 10-digit number.",
  }),
  fbUsername: z.string().min(1).max(255),
  fbPassword: z.string().min(8),
  fbProfileLink: z.string().url(),
  selfies: z.array(z.string()).min(3).max(3),
  aadharCard: z.string().url(),
  alternativeID: z.string().refine((value) => alternativeIDs.includes(value)),
  dob: z.date({
    required_error: "A date of birth is required.",
  }),
  gender: z.enum(["Male", "Female", "Other"]),
});
