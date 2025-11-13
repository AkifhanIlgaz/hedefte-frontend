import { z } from "zod";

export const forgotPasswordSchema = z
  .object({
    email: z.email("Lütfen geçerli bir e-posta giriniz.").max(255),
  })
  .strict();

export type ForgotPasswordRequest = z.infer<typeof forgotPasswordSchema>;
