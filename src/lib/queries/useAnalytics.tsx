import { Exam, LessonName } from "@/src/features/analiz/types";
import { useQuery } from "@tanstack/react-query";
import analyticsService from "../services/analyticsService";

export const useExamAnalytics = (exam: Exam, timeInterval: number) => {
  return useQuery({
    queryKey: ["analytics", "exams", exam, timeInterval],
    queryFn: () => analyticsService.getExamAnalytics(exam, timeInterval),
    staleTime: 1000 * 60 * 5, // Data is fresh for 5 minutes
  });
};

export const useLessonAnalytics = (
  exam: Exam,
  lesson: LessonName,
  timeInterval: number,
) => {
  return useQuery({
    queryKey: ["analytics", "lessons", exam, lesson, timeInterval],
    queryFn: () =>
      analyticsService.getLessonAnalytics(exam, lesson, timeInterval),
    staleTime: 1000 * 60 * 5, // Data is fresh for 5 minutes
  });
};
