import z from "zod";

export const getTopicMistakesSchema = z.object({
  exam: z.string("Lütfen bir sınav seçin."),
  lesson: z.string().optional(),
  topic: z.string().optional(),
  timeInterval: z.number("Lütfen bir zaman aralığı seçin.").min(-1).max(6),
  page: z.number().min(1),
  rowsPerPage: z.number().min(1).max(50),
});

export type GetTopicMistakesRequest = z.infer<typeof getTopicMistakesSchema>;
