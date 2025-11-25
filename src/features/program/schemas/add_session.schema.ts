import { z } from "zod";

export const addSessionSchema = z
  .object({
    date: z.date("Lütfen geçerli bir tarih giriniz."),
    exam: z.string("Lütfen geçerli bir sınav giriniz.").max(255),
    type: z.string("Lütfen geçerli bir tür giriniz.").max(255),
    lesson: z.string("Lütfen geçerli bir ders giriniz.").max(255),
    topic: z.string("Lütfen geçerli bir konu giriniz.").max(255),
    goal: z.string("Lütfen geçerli bir hedef giriniz.").max(255).optional(),
  })
  .strict();

export type AddSessionRequest = z.infer<typeof addSessionSchema>;
