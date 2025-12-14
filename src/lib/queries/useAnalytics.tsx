import { Exam, LessonAnalytics, LessonName } from "@/src/features/analiz/types";
import { useQuery } from "@tanstack/react-query";
import analyticsService from "../services/analyticsService";

export const useExamAnalytics = (exam: Exam, timeInterval: number) => {
  return useQuery({
    queryKey: ["analytics", "exams", exam, timeInterval],
    queryFn: () => analyticsService.getExamAnalytics(exam, timeInterval),
    staleTime: 1000 * 60 * 5, // Data is fresh for 5 minutes
  });
};

export const useLessonAnalytics = (exam: Exam, timeInterval: number) => {
  return useQuery({
    queryKey: ["analytics", "lessons", exam, timeInterval],
    queryFn: () => analyticsService.getLessonAnalytics(exam, timeInterval),
    staleTime: 1000 * 60 * 5, // Data is fresh for 5 minutes
  });
};

export const useAnalyticsOfLesson = (
  exam: Exam,
  lesson: LessonName,
  timeInterval: number,
) => {
  return useQuery({
    queryKey: ["analytics", "lessons", exam, timeInterval],
    queryFn: () => analyticsService.getLessonAnalytics(exam, timeInterval),
    select: (data: LessonAnalytics[]) => data.find((l) => l.lesson === lesson),
    staleTime: 1000 * 60 * 5,
  });
};
