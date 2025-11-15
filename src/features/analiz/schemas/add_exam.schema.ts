import z from "zod";
import { eaLessons, mfLessons, tytLessons } from "../data";
import { createLessonsSchema } from "../utils";

export const lessonAnalysisSchema = z.object({
  correct: z.number(),
  wrong: z.number(),
  empty: z.number(),
  time: z.number(),
});

export const addTytExamSchema = z
  .object({
    date: z.date("Lütfen deneme tarihini giriniz."),
    name: z.string().min(1, "Lütfen deneme ismini giriniz.").max(50),
    totalNet: z.number(),
  })
  .extend(createLessonsSchema(tytLessons).shape);

export const addMfExamSchema = z
  .object({
    date: z.date("Lütfen deneme tarihini giriniz."),
    name: z.string().min(1, "Lütfen deneme ismini giriniz.").max(50),
    totalNet: z.number(),
  })
  .extend(createLessonsSchema(mfLessons).shape);

export const addEaExamSchema = z
  .object({
    date: z.date("Lütfen deneme tarihini giriniz."),
    name: z.string().min(1, "Lütfen deneme ismini giriniz.").max(50),
    totalNet: z.number(),
  })
  .extend(createLessonsSchema(eaLessons).shape);
