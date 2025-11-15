import z from "zod";
import { lessonAnalysisSchema } from "./schemas/add_exam.schema";
import { LessonName, Lesson } from "./types";

export const createLessonsSchema = (lessons: Record<LessonName, Lesson>) => {
  return z.object(
    Object.fromEntries(
      Object.entries(lessons).map(([lessonName, info]) => {
        return [
          lessonName,
          lessonAnalysisSchema.refine(
            (data) => data.correct + data.wrong <= info.totalQuestions,
            {
              message: `Girdiğin doğru, yanlış ve boş sayılarının toplamı, (${info.totalQuestions}) soruyu aşamaz.`,
            },
          ),
        ];
      }),
    ),
  );
};
