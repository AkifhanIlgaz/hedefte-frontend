import z from "zod";

export const topicMistakesSchema = z.object({
  imageUrl: z.url("Lütfen geçerli bir URL giriniz."),
  date: z.date("Lütfen tarihi giriniz."),
  examType: z.string().min(1, "Lütfen sınav türünü giriniz.").max(50),
  filePath: z.string().min(1, "Lütfen dosya yolunu giriniz.").max(255),
  lesson: z.string().min(1, "Lütfen ders adını giriniz.").max(50),
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

export const lessonAnalysisSchema = (totalQuestions: number) => {
  return z
    .object({
      correct: z.number().min(0),
      wrong: z.number().min(0),
      empty: z.number().min(0),
      time: z.number().min(0, "Lütfen zamanı giriniz."),
      topicMistakes: z.array(topicMistakesSchema),
    })
    .refine(
      (data) => data.correct + data.wrong + data.empty <= totalQuestions,
      {
        message: `Toplam doğru, yanlış ve boş sayısı ${totalQuestions} olmalıdır.`,
      },
    );
};

export const addTytExamSchema = z.object({
  date: z.date("Lütfen deneme tarihini giriniz."),
  name: z.string().min(1, "Lütfen deneme ismini giriniz.").max(50),
  Türkçe: lessonAnalysisSchema(40),
  Tarih: lessonAnalysisSchema(5),
  Coğrafya: lessonAnalysisSchema(5),
  Felsefe: lessonAnalysisSchema(5),
  "Din Kültürü": lessonAnalysisSchema(5),
  Matematik: lessonAnalysisSchema(40),
  Fizik: lessonAnalysisSchema(7),
  Kimya: lessonAnalysisSchema(7),
  Biyoloji: lessonAnalysisSchema(6),
});

export const addSayExamSchema = z.object({
  date: z.date("Lütfen deneme tarihini giriniz."),
  name: z.string().min(1, "Lütfen deneme ismini giriniz.").max(50),
  Matematik: lessonAnalysisSchema(40),
  Fizik: lessonAnalysisSchema(14),
  Kimya: lessonAnalysisSchema(13),
  Biyoloji: lessonAnalysisSchema(13),
});

export const addEaExamSchema = z.object({
  date: z.date("Lütfen deneme tarihini giriniz."),
  name: z.string().min(1, "Lütfen deneme ismini giriniz.").max(50),
  Edebiyat: lessonAnalysisSchema(24),
  Tarih: lessonAnalysisSchema(10),
  Coğrafya: lessonAnalysisSchema(6),
  Matematik: lessonAnalysisSchema(40),
});
