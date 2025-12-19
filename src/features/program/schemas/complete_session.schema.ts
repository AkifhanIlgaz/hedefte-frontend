// type CompleteSessionRequest struct {
// 	Id            bson.ObjectID `json:"id"`
// 	UserId        string        `json:"-"`
// 	QuestionCount int           `json:"questionCount,omitempty"`
// 	Duration      time.Duration `json:"duration"`
// 	Notes         string        `json:"notes"`
// }

import { z } from "zod";

export const completeSesssionSchema = z
  .object({
    id: z.string(),
    duration: z.number("Lütfen geçerli bir süre giriniz.").min(0),
    questionCount: z
      .number("Lütfen geçerli bir sayı giriniz.")
      .min(1, "Lütfen geçerli bir sayı giriniz.")
      .optional(),
    notes: z.string("Lütfen geçerli bir not giriniz.").max(255).optional(),
  })
  .strict();

export type CompleteSessionRequest = z.infer<typeof completeSesssionSchema>;
