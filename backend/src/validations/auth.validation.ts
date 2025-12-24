import { z } from "zod";

const emailSchema = z
  .string()
  .min(1, "Email is required")
  .email("Invalid email address");

const passwordSchema = z
  .string()
  .min(1, "Password is required")
  .min(8, "Password must be at least 8 characters");

export const signupSchema = z.object({
  body: z.object({
    name: z.string().min(1, "Name is required"),
    email: emailSchema,
    password: passwordSchema,
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: emailSchema,
    password: passwordSchema,
  }),
});

export type SignUpUserDTO = z.infer<typeof signupSchema>["body"];
export type LoginUserDTO = z.infer<typeof loginSchema>["body"];
