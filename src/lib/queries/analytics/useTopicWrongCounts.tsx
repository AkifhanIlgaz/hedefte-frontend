import { Exam, LessonName } from "@/src/features/analiz/types";
import { useQuery } from "@tanstack/react-query";
import topicMistakeService from "../../services/topicMistakeService";

export const useTopicWrongCounts = (
  exam: Exam,
  lesson: LessonName,
  timeInterval: number,
) => {
  return useQuery({
    queryKey: ["topic-mistakes", exam, lesson, timeInterval],
    queryFn: () =>
      topicMistakeService.getWrongCounts(exam, lesson, timeInterval),
    staleTime: 1000 * 60 * 5,
  });
};
