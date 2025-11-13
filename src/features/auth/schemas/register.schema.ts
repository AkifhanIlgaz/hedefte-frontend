import { z } from "zod";
import { passwordSchema } from "./password.schema";

export const registerSchema = z
  .object({
    firstName: z.string().min(1, "Lütfen adınızı giriniz.").max(50),
    lastName: z.string().min(1, "Lütfen soyadınızı giriniz.").max(50),
    email: z.email("Lütfen geçerli bir e-posta giriniz.").max(255),
    password: passwordSchema,
    confirmPassword: passwordSchema,
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Şifreleriniz eşleşmiyor.",
    path: ["confirmPassword"],
  })
  .strict();

export type RegisterRequest = z.infer<typeof registerSchema>;
