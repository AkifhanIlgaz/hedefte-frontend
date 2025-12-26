import z from "zod";

export const solveTopicMistakeSchema = z.object({
  id: z.string("Lütfen ID giriniz."),
  confidence: z.number("Lütfen güven skorunu giriniz.").min(0).max(2),
});

export type SolveTopicMistakeRequest = z.infer<typeof solveTopicMistakeSchema>;
