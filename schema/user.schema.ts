import { z } from "zod";

export const profileFormSchema = z.object({
  name: z.string().optional(),
  email: z.string().optional(),
  phone: z.string().optional(),
  skype: z.string().optional(),
  telegram: z.string().optional(),
  whatsapp: z.string().optional(),
  facebook: z.string().optional(),
});

export type ProfileFormValues = z.infer<typeof profileFormSchema>;
