import z from "zod";

export const topicMistakesSchema = z.object({
  imageUrl: z.url("Lütfen geçerli bir URL giriniz."),
  filePath: z.string().min(1, "Lütfen dosya yolunu giriniz.").max(255),
  topic: z.string().min(1, "Lütfen konu adını giriniz.").max(50),
});

export const lessonSchema = z
  .object({
    correct: z.number().min(0),
    wrong: z.number().min(0),
    empty: z.number().min(0),
    totalQuestions: z.number().min(0),
    time: z.number().min(0, "Lütfen zamanı giriniz."),
    topicMistakes: z.array(topicMistakesSchema).default([]),
  })
  .refine(
    (data) => data.correct + data.wrong + data.empty <= data.totalQuestions,
    {
      message: `Doğru, yanlış ve boş sayısı toplam soru sayısından büyük olamaz.`,
    },
  );

export const addExamSchema = z.object({
  examType: z.string().min(1, "Lütfen sınav türünü giriniz.").max(50),
  date: z.date("Lütfen tarihi giriniz."),
  name: z.string().min(1, "Lütfen sınav ismini giriniz.").max(50),
  lessons: z.record(z.string(), lessonSchema),
});

export type AddExamRequest = z.infer<typeof addExamSchema>;
