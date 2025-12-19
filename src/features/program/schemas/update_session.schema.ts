import { z } from "zod";

export const updateSessionSchema = z
  .object({
    id: z.string(),
    date: z.date("Lütfen geçerli bir tarih giriniz."),
    exam: z.string("Lütfen geçerli bir sınav giriniz.").max(255),
    type: z.string("Lütfen geçerli bir tür giriniz.").max(255),
    lesson: z.string("Lütfen geçerli bir ders giriniz.").max(255),
    topic: z.string("Lütfen geçerli bir konu giriniz.").max(255),
    isCompleted: z.boolean("Lütfen geçerli bir durum giriniz."),
    goal: z.string("Lütfen geçerli bir hedef giriniz.").max(255).optional(),
    notes: z.string("Lütfen geçerli bir not giriniz.").max(255).optional(),
    duration: z.number("Lütfen geçerli bir süre giriniz.").min(0).optional(),
    questionCount: z.number("Lütfen geçerli bir sayı giriniz.").optional(),
  })
  .strict();

export type UpdateSessionRequest = z.infer<typeof updateSessionSchema>;
