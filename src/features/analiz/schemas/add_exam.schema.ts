import z from "zod";

export const topicMistakesSchema = z.object({
  topicName: z.string(),
  mistakeCount: z.number(),
});

export const lessonAnalysisSchema = z.object({
  correct: z.number().min(0),
  wrong: z.number().min(0),
  empty: z.number().min(0),
  time: z.number().min(0, "Lütfen zamanı giriniz."),
  topicMistakes: z.array(topicMistakesSchema),
});

export const addTytExamSchema = z.object({
  date: z.date("Lütfen deneme tarihini giriniz."),
  name: z.string().min(1, "Lütfen deneme ismini giriniz.").max(50),
  Türkçe: lessonAnalysisSchema,
  Tarih: lessonAnalysisSchema,
  Coğrafya: lessonAnalysisSchema,
  Felsefe: lessonAnalysisSchema,
  DinKültürü: lessonAnalysisSchema,
  Matematik: lessonAnalysisSchema,
  Fizik: lessonAnalysisSchema,
  Kimya: lessonAnalysisSchema,
  Biyoloji: lessonAnalysisSchema,
});

export const addSayExamSchema = z.object({
  date: z.date("Lütfen deneme tarihini giriniz."),
  name: z.string().min(1, "Lütfen deneme ismini giriniz.").max(50),
  Matematik: lessonAnalysisSchema,
  Fizik: lessonAnalysisSchema,
  Kimya: lessonAnalysisSchema,
  Biyoloji: lessonAnalysisSchema,
});

export const addEaExamSchema = z.object({
  date: z.date("Lütfen deneme tarihini giriniz."),
  name: z.string().min(1, "Lütfen deneme ismini giriniz.").max(50),
  Edebiyat: lessonAnalysisSchema,
  Tarih: lessonAnalysisSchema,
  Coğrafya: lessonAnalysisSchema,
  Matematik: lessonAnalysisSchema,
});
