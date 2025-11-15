import z from "zod";
import { eaLessons, mfLessons, tytLessons } from "../data";
import { createLessonsSchema } from "../utils";
import { Exam } from "../types";
import { Field } from "../../profil/data";

export const topicMistakesSchema = z.object({
  topicName: z.string(),
  mistakeCount: z.number(),
});

export const lessonAnalysisSchema = z.object({
  correct: z.union([z.string(), z.number()]).pipe(z.number().min(0)),
  wrong: z.union([z.string(), z.number()]).pipe(z.number().min(0)),
  empty: z.union([z.string(), z.number()]).pipe(z.number().min(0)),
  time: z.union([z.string(), z.number()]).pipe(z.number().min(0)),
  topicMistakes: z.array(topicMistakesSchema),
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

export const getExamSchema = (exam: Exam, field?: Field) => {
  if (exam === "TYT") return addTytExamSchema;
  if (field === "Sayısal") return addMfExamSchema;
  if (field === "Eşit Ağırlık") return addEaExamSchema;
};
