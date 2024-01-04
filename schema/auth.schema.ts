import * as z from "zod";

export const passwordSchema = z
  .string({
    required_error: "Password is required",
    invalid_type_error: "Password must be a string",
  })
  .min(8, { message: "Password must be at least 8 characters" })
  .regex(/[a-z]+/, {
    message: "Password must contain at least one lowercase letter",
  })
  .max(100)
  .regex(/[A-Z]+/, {
    message: "Password must contain at least one uppercase letter",
  })
  .regex(/[0-9]+/, { message: "Password must contain at least one number" })
  .regex(/[^a-zA-Z0-9]+/, {
    message: "Password must contain at least one special character",
  });

export const authSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address",
  }),
  password: passwordSchema,
});

export const loginSchema = z.object({
  email: authSchema.shape.email,
  password: z.string(),
});

export const verifyEmailSchema = z.object({
  code: z
    .string()
    .min(6, {
      message: "Verification code must be 6 characters long",
    })
    .max(6),
});

export const checkEmailSchema = z.object({
  email: authSchema.shape.email,
});

export const resetPasswordSchema = z
  .object({
    password: authSchema.shape.password,
    confirmPassword: authSchema.shape.password,
    code: verifyEmailSchema.shape.code,
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const userPrivateMetadataSchema = z.object({
  role: z.enum(["user", "admin", "super_admin"]),
});
